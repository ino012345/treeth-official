import { registerHooks } from "node:module";
import { load, resolve } from "./loader.mjs";

registerHooks({ resolve, load });
