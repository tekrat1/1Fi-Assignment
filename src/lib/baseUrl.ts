import { headers } from "next/headers";

export function getBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  const requestHeaders = headers();
  const host = requestHeaders.get("host");
  if (!host) throw new Error("Unable to determine the request host");

  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
