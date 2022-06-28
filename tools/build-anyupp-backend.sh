#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
rm -rf cdk.out
mkdir -p build

LAMBDAS="appsync-lambda
rkeeper-webhook
stripe-webhook
crud-api-updater
stack-seeder
stuck-order-cleanup"

DOCKER_PROCESSES="report-generator
rkeeper-product-processor"

IFS=$'\n'

for name in $LAMBDAS; do
  mkdir -p ./build/$name
  yarn esbuild lib/lambda/$name/index.ts \
    --target=node14 \
    --external:aws-sdk \
    --bundle \
    --platform=node \
    --minify \
    --outfile=./build/$name/index.js
done

for name in $DOCKER_PROCESSES; do
  yarn esbuild lib/lambda/$name/index.ts \
    --target=node14 \
    --bundle \
    --platform=node \
    --minify \
    --outfile=./build/$name.js
done

cd ../..

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json
mkdir -p $(dirname $STACKCONFIG_FILE)

echo $STACKCONFIG_FILE

if [ -f $STACKCONFIG_FILE ]; then
  ln -sf $PWD/$STACKCONFIG_FILE $PWD/libs/shared/config/src/lib/generated/stack-config.json
fi
