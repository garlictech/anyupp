#!/bin/bash

# Must be executed from apps/anyupp-backend

set -e
IFS='|'

ENVNAME=$1
APPNAME=anyupp-backend

STACKCONFIG_FILE=libs/integration-tests/universal/src/lib/generated/stack-config.json

docker build -t rkeeper-products -f Dockerfile.process-products .
docker tag rkeeper-products:latest ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/rkeeper-products:latest
docker push ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/rkeeper-products:latest
yarn sst deploy --stage=$ENVNAME --outputs-file ../../$STACKCONFIG_FILE
yarn sst remove $ENVNAME-$APPNAME-configurator --stage=$ENVNAME
cd ../..
yarn ts-node ./tools/fetch-configuration.ts $ENVNAME

# Process stack-config: remove stage label
echo "Creating stack config for testing ($STACKCONFIG_FILE)"
sed -i "s/^  \"${ENVNAME}\-anyupp\-backend/\"anyupp-backend/g" $STACKCONFIG_FILE

