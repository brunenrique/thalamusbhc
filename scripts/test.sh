#!/bin/bash
set -euo pipefail
npm ci
npx firebase emulators:exec --only firestore "npm test"
