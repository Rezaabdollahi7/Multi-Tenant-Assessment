# Build from the repository root:
#   docker build -f apps/api/Dockerfile .

FROM node:22-slim AS base
RUN npm install --global pnpm@11.25.0
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile --filter api...
RUN pnpm --filter api build \
 && pnpm --filter api deploy --prod --legacy /out

FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out/package.json ./
COPY --from=build /out/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
USER node
EXPOSE 3001
# Seed fabricated data on the first start only, then serve.
CMD ["sh", "-c", "node dist/seed/seed.js --if-empty && exec node dist/main.js"]
