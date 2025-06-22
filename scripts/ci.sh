#!/bin/bash
set -euo pipefail

npm run lint
npm run typecheck
npm run test:all

