FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS build
COPY pnpm-workspace.yaml package.json ./
COPY apps/web apps/web
COPY tsconfig.base.json ./
RUN pnpm install --frozen-lockfile --filter web...
RUN pnpm --filter web build

FROM nginx:alpine AS runtime
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
