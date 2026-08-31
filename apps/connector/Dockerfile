# ---- build ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json nest-cli.json ./
COPY src src
RUN npm run build

# ---- runtime ----
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
ENV HOME=/tmp
USER nestjs
HEALTHCHECK --interval=5s --timeout=5s --start-period=15s --retries=3 \
  CMD test $(( $(date +%s) - $(stat -c %Y /tmp/connector-heartbeat) )) -lt 15
CMD ["node", "dist/main"]
