# Base

FROM node:26-alpine3.23 AS base

RUN npm install --global pnpm@^11.1.0

WORKDIR /server

# Build

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY kysely.config.ts tsconfig.json ./
COPY migrations ./migrations
COPY source ./source
RUN pnpm exec tsc

# Development

FROM base AS development

CMD ["pnpm", "tsx", "watch", "source/index.ts"]

# Production

FROM base AS production

RUN apk add --no-cache go-task-task postgresql-client

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /server/output ./output
COPY kysely.config.ts ./
COPY Taskfile.production.yaml ./Taskfile.yaml

CMD ["node", "output/source/index.js"]
