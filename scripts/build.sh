#!/bin/bash

# Remove the build directory if it exists
if [ -d "./build" ]; then
    rm -rf ./build
fi

# Create the new build directory and the necessary files
mkdir -p ./build/chrome
mkdir -p ./build/firefox


cp content.css offscreen.js offscreen.html background.html background.js config.js content.js contentScript.js popup.js popup.html ./build/chrome

mkdir -p ./build/chrome/c2pa/packages/c2pa
mkdir -p ./build/chrome/c2pa/packages/c2pa-wc

# Copy the directories
cp -r ./c2pa/packages/c2pa/dist ./build/chrome/c2pa/packages/c2pa/dist
cp -r ./c2pa/packages/c2pa-wc/dist ./build/chrome/c2pa/packages/c2pa-wc/dist
cp -r ./images ./build/chrome/images
cp -r ./lib ./build/chrome/lib
cp -r ./node_modules ./build/chrome/node_modules

# Override the content of lib/log.js
# echo "const debug = (message) => {
#   // do nothing in prod
# };

# export default debug;" > ./build/chrome/lib/log.js

cp -r ./build/chrome/ ./build/firefox
cp manifest.chrome.json ./build/chrome/manifest.json
cp manifest.firefox.json ./build/firefox/manifest.json