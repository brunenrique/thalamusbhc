#!/bin/bash
set -euo pipefail

if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
  echo "SENTRY_AUTH_TOKEN nao definido; pulando upload para o Sentry" >&2
  exit 0
fi

RELEASE=${SENTRY_RELEASE:-$(git rev-parse --short HEAD)}

npx sentry-cli releases new "$RELEASE"
npx sentry-cli releases set-commits "$RELEASE" --auto
npx sentry-cli releases files "$RELEASE" upload-sourcemaps .next --rewrite
npx sentry-cli releases finalize "$RELEASE"
