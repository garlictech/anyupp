#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
node --max-old-space-size=8192 ../../node_modules/.bin/sls package --verbose --stage=$ENVNAME

cd ../..

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json
mkdir -p `dirname $STACKCONFIG_FILE`

echo $STACKCONFIG_FILE

if [ -f $STACKCONFIG_FILE ]; then
  ln -sf $PWD/$STACKCONFIG_FILE $PWD/libs/shared/config/src/lib/generated/stack-config.json
fi
