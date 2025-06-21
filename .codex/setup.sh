#!/bin/bash
set -euo pipefail

# Ensure Node.js 20 is active for firebase-tools compatibility
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 20 >/dev/null
nvm use 20 >/dev/null

# Install dependencies
npm ci

# Run tests with Firestore emulator
npx firebase emulators:exec --project=demo-project --only firestore "npx jest --runInBand"
