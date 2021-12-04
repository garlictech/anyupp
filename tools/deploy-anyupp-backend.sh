#!/bin/bash

# Must be executed from apps/anyupp-backend

set -e
IFS='|'

ENVNAME=$1

STACKCONFIG_FILE=libs/integration-tests/universal/src/lib/generated/stack-config.json

yarn sst deploy --stage=$ENVNAME --outputs-file ../../$STACKCONFIG_FILE
cd ../..
yarn ts-node ./tools/fetch-configuration.ts $ENVNAME

# Process stack-config: remove stage label
echo "Creating stack config for testing ($STACKCONFIG_FILE)"
sed -i "s/^  \"${ENVNAME}\-anyupp\-backend/\"anyupp-backend/g" $STACKCONFIG_FILE

