#!/bin/bash
set -euo pipefail
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
cd ~/studio
npm ci
firebase emulators:start --only firestore,auth --import=./emulator-data --export-on-exit &
sleep 5
npm run dev
