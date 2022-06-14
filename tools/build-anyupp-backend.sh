#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
rm -rf cdk.out
mkdir -p build
yarn esbuild lib/lambda/rkeeper-product-processor/index.ts --bundle --platform=node --minify --outfile=./build/rkeeper-product-processor.js
yarn esbuild lib/lambda/report-generator/index.ts --bundle --platform=node --minify --outfile=./build/report-generator.js
cd ../..

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json
mkdir -p $(dirname $STACKCONFIG_FILE)

echo $STACKCONFIG_FILE

if [ -f $STACKCONFIG_FILE ]; then
  ln -sf $PWD/$STACKCONFIG_FILE $PWD/libs/shared/config/src/lib/generated/stack-config.json
fi
