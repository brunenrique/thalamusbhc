#!/bin/bash

if [ ! -x "node_modules/.bin/jest" ]; then
  echo "Jest não encontrado. Execute 'npm install' para instalar as dependências." >&2
  exit 1
fi

npx jest
