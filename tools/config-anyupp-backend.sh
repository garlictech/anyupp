#!/bin/bash

set -e
IFS='|'

ENVNAME=$1

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json

echo "***********************************"
echo $STACKCONFIG_FILE
ls -l $STACKCONFIG_FILE


if [ -f $STACKCONFIG_FILE ]; then
  echo "COPYYING"
  cp $STACKCONFIG_FILE libs/shared/config/src/lib/generated/stack-config.json
fi

ls -l libs/shared/config/src/lib/generated/stack-config.json
echo "***********************************"
