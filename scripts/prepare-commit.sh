#!/bin/bash

if [ ! -d node_modules ]; then
  echo "Execute npm install antes de commitar" >&2
  exit 1
fi

npm run lint
npm run typecheck
npm test
