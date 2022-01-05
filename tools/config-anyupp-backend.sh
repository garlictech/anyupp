#!/bin/bash

set -e
IFS='|'

ENVNAME=$1

STACKCONFIG_DIR=libs/shared/config/src/lib/stack-config
STACKCONFIG_FILE=$STACKCONFIG_DIR/${ENVNAME}/stack-config.json

if [ -f $STACKCONFIG_FILE ]; then
  cd libs/shared/config/src/lib/generated
  ln -sf ../stack-config/${ENVNAME}/stack-config.json .
fi
