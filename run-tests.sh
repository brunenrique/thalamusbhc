#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
echo "📦 Instalando dependências via npm..."
npm ci

echo "🔥 Rodando testes com Firebase Emulator via Volta..."
npx firebase emulators:exec --project="${FIREBASE_PROJECT:-thalamus-dev}" --only firestore "npx jest --runInBand --coverage"
