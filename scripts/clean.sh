#!/bin/bash
rm -rf node_modules .next .jest-cache
npm cache clean --force
npm install
