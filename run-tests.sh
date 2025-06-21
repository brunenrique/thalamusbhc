#!/bin/bash
set -euo pipefail

echo "📦 Instalando dependências via npm..."
npm ci

echo "🔥 Rodando testes com Firebase Emulator via Volta..."
npx firebase emulators:exec --project=thalamus-dev --only firestore "npx jest --runInBand"
