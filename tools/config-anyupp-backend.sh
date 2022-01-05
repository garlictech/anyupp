#!/bin/bash

set -e
IFS='|'

ENVNAME=$1

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json

if [ -f $STACKCONFIG_FILE ]; then
  ln -sf $PWD/$STACKCONFIG_FILE $PWD/libs/shared/config/src/lib/generated/stack-config.json
fi

echo "*******************************************"
echo $PWD/$STACKCONFIG_FILE
echo $PWD/libs/shared/config/src/lib/generated/stack-config.json
ls -l $PWD/libs/shared/config/src/lib/generated/stack-config.json
pwd
ls -l $PWD/libs/shared/config/src/lib
cat $PWD/libs/shared/config/src/lib/generated/stack-config.json
echo "*******************************************"
