#!/bin/bash

set -euo pipefail

rm -rf ./build
npx webpack --mode production
mkdir -p ./build
cp -R ./dist/. ./build/