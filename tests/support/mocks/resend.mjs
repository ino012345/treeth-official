/**
 * Test double for the `resend` package. Records what would have been sent and
 * never touches the network. Tests read and reset `globalThis.__resendSent`,
 * and can force a failure with `globalThis.__resendError`.
 */
globalThis.__resendSent ??= [];

export class Resend {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.emails = {
      send: async (payload) => {
        if (globalThis.__resendError) return { data: null, error: globalThis.__resendError };
        globalThis.__resendSent.push(payload);
        return { data: { id: `test-${globalThis.__resendSent.length}` }, error: null };
      },
    };
  }
}
