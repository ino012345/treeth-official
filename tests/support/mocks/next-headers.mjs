/** Test double for `next/headers`. The caller IP comes from `globalThis.__testIp`. */
export async function headers() {
  return new Headers({ "x-forwarded-for": globalThis.__testIp ?? "203.0.113.1" });
}
