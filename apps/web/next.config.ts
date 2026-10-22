import path from "node:path";
import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  output: "standalone",
  // Trace files from the monorepo root so workspace dependencies are included.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // The browser only talks to this origin; /api is proxied to the API (ADR 0002).
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
