#!/bin/bash

# Must be executed from apps/anyupp-backend

set -e
IFS='|'

ENVNAME=$1

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json

mkdir -p `dirname ../../$STACKCONFIG_FILE`
yarn sst deploy --stage=$ENVNAME --outputs-file ../../$STACKCONFIG_FILE
cd ../..
yarn ts-node ./tools/fetch-configuration.ts $ENVNAME

# Process stack-config: remove stage label
echo "Creating stack config for testing ($STACKCONFIG_FILE)"
sed -i "s/^  \"${ENVNAME}\-anyupp\-backend/\"anyupp-backend/g" $STACKCONFIG_FILE

if [ -f $STACKCONFIG_FILE ]; then
  cd libs/shared/config/src/lib/generated
  ln -sf ../stack-config/${ENVNAME}/stack-config.json .
fi

