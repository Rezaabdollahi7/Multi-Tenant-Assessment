# Build from the repository root:
#   docker build -f apps/web/Dockerfile --build-arg API_URL=http://api:3001 .

FROM node:22-slim AS base
RUN npm install --global pnpm@11.25.0
WORKDIR /repo

FROM base AS build
# Next.js bakes rewrites in at build time, so the API address is a build argument.
ARG API_URL=http://api:3001
ENV API_URL=$API_URL NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm install --frozen-lockfile --filter frontend...
RUN pnpm --filter frontend build

FROM node:22-slim AS runtime
# Also needed at runtime: the proxy and Server Components call the API directly.
ARG API_URL=http://api:3001
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 \
    API_URL=$API_URL
WORKDIR /app
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
