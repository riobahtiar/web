import type { MiddlewareHandler } from "astro";

const CANONICAL_HOST = "rio.my.id";

// The Worker answers on more hostnames than the one we publish: the
// `workers.dev` subdomain, a per-version preview URL for every deployment, and
// whatever custom domain gets pointed at it. Google indexed several of those
// next to the real site. A 301 drains them from the index and hands their
// ranking signals to the canonical host; turning the workers.dev route off
// instead would strand the indexed URLs with nothing to follow.
const isLocalHost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname.endsWith(".localhost");

export const onRequest: MiddlewareHandler = (context, next) => {
  const { hostname } = context.url;

  if (hostname === CANONICAL_HOST || isLocalHost(hostname)) return next();

  const target = new URL(context.url);
  target.protocol = "https:";
  target.hostname = CANONICAL_HOST;
  target.port = "";

  return context.redirect(target.toString(), 301);
};
