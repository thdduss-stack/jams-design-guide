FROM 905418085337.dkr.ecr.ap-northeast-2.amazonaws.com/base-image/node:22.17.1-alpine-arm64-20250801 AS base

RUN apk add --no-cache bash

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS build-base

USER root

ENV HOME=/root

WORKDIR /app

# corepack으로 pnpm 활성화 (Node.js 22에 내장)
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm --version

FROM build-base AS build-deps

COPY ./package.json ./pnpm-lock.yaml ./.npmrc ./

RUN --mount=type=tmpfs,target=/tmp \
  --mount=type=cache,target=/usr/local/share/.config/yarn \
  --mount=type=cache,target=/usr/local/share/.cache/yarn \
  --mount=type=cache,target=/root/.cache \
  --mount=type=cache,target=/root/.local \
  --mount=type=cache,target=/.pnpm-store \
  --mount=type=cache,target=/app/.next/cache \
  PUPPETEER_SKIP_DOWNLOAD=true pnpm install --no-color --frozen-lockfile

FROM build-deps AS build

COPY . .

RUN --mount=type=tmpfs,target=/tmp \
  --mount=type=cache,target=/usr/local/share/.config/yarn \
  --mount=type=cache,target=/usr/local/share/.cache/yarn \
  --mount=type=cache,target=/root/.cache \
  --mount=type=cache,target=/root/.local \
  --mount=type=cache,target=/.pnpm-store \
  --mount=type=cache,target=/app/.next/cache \
  <<RUNEOF
    set -eux -o pipefail
    export NODE_ENV=production
    pnpm build
RUNEOF

FROM base

# Puppeteer를 위한 Chromium 설치
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

# Puppeteer가 설치된 Chromium을 사용하도록 환경 변수 설정
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY --from=build --chown=1001:1001 /app/.next/standalone /app/

RUN <<RUNEOF
    set -eux -o pipefail

    addgroup --system --gid 1001 svc_app
    adduser --system --uid 1001 svc_app

    # /app/server.js 내용 Replace시 필요
    install -d root -g svc_app -m 0775 /app
    install -o svc_app -g svc_app -m 0644 /dev/null /app/.env

    # 구동 스크립트
    install -o root -g root -m 0755 /dev/null /app/run
    cat <<EOF > /app/run
#!/bin/bash
set -eu -o pipefail

echo '[*] Current environments:'
env
echo


echo '[*] Starting application...'
set -x
node ./scripts/prestart/index.mjs next-env -e \${APP_PROFILE} -m production

exec node ./server.js
EOF
RUNEOF

USER 1001:1001
ENV HOME=/home/svc_app
ENV NODE_ENV=production

ENTRYPOINT ["/app/run"]
