import { headers } from "next/headers";

// Builds an absolute URL so server components can call our own /api routes
// with fetch() (relative URLs don't work in server-side fetch).
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  const h = headers();
  const host = h.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
