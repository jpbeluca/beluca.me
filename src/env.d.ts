/// <reference types="astro/client" />

// Secrets are bound to the Worker (`wrangler secret put`), so they arrive on
// the request-scoped runtime rather than through import.meta.env.
type CloudflareEnv = {
  OPENAI_API_KEY?: string;
  SLACK_WEBHOOK_URL?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
