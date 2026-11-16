/**
 * Synchronous module hooks (module.registerHooks) for `node --test`, so tests
 * can import the app's .ts/.tsx modules without a build step.
 *
 *  - `@/…` resolves to `src/…` (the tsconfig path alias)
 *  - extensionless relative imports inside src/ resolve to .ts / .tsx
 *  - .ts / .tsx under src/ are compiled with the project's own TypeScript
 *    (transpile only, react-jsx) — type checking stays with `tsc --noEmit`
 *  - `resend` and `next/headers` resolve to test doubles, so no test can send
 *    mail or needs a request context
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const srcUrl = pathToFileURL(path.join(root, "src") + path.sep).href;

const MOCKS = {
  resend: new URL("./mocks/resend.mjs", import.meta.url).href,
  "next/headers": new URL("./mocks/next-headers.mjs", import.meta.url).href,
};

function withExtension(base) {
  for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (existsSync(base + ext)) return pathToFileURL(base + ext).href;
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  if (MOCKS[specifier]) return { url: MOCKS[specifier], shortCircuit: true };

  if (specifier.startsWith("@/")) {
    const url = withExtension(path.join(root, "src", specifier.slice(2)));
    if (url) return { url, shortCircuit: true };
  }

  const fromSrc = context.parentURL?.startsWith(srcUrl);
  if (fromSrc && /^\.\.?\//.test(specifier) && !path.extname(specifier)) {
    const url = withExtension(fileURLToPath(new URL(specifier, context.parentURL)));
    if (url) return { url, shortCircuit: true };
  }

  try {
    return nextResolve(specifier, context);
  } catch (error) {
    // Packages without an "exports" map (next/link, next/headers…) need the
    // file extension under ESM; the bundler adds it in the real build.
    const bareSubpath = /^[@a-z][^:]*\/[^.]+$/i.test(specifier);
    if (error?.code === "ERR_MODULE_NOT_FOUND" && bareSubpath) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw error;
  }
}

export function load(url, context, nextLoad) {
  const { pathname } = new URL(url);
  if (url.startsWith(srcUrl) && /\.tsx?$/.test(pathname)) {
    const file = fileURLToPath(url);
    const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
