#!/bin/bash

# Remove the build directory if it exists
if [ -d "./build" ]; then
    rm -rf ./build
fi

# Create the new build directory and the necessary files
mkdir -p ./build


cp content.css sandbox.js sandbox.html background.html background.js config.js content.js contentScript.js inject.js popup.js popup.html manifest.json ./build/

mkdir -p ./build/c2pa/packages/c2pa
mkdir -p ./build/c2pa/packages/c2pa-wc

# Copy the directories
cp -r ./c2pa/packages/c2pa/dist ./build/c2pa/packages/c2pa/dist
cp -r ./c2pa/packages/c2pa-wc/dist ./build/c2pa/packages/c2pa-wc/dist
cp -r ./images ./build/images
cp -r ./lib ./build/lib
cp -r ./node_modules ./build/node_modules

# Override the content of ./build/lib/log.js
echo "const debug = (message) => {
  // do nothing in prod
};

export default debug;" > ./build/lib/log.js