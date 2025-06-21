#!/bin/bash
rm -rf emulator-data
firebase emulators:start --only firestore,auth
