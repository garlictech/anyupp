#!/bin/bash

# Must be executed from apps/anyupp-global

set -e
IFS='|'

ENVNAME=$1

mkdir -p $(dirname ../../$STACKCONFIG_FILE)
yarn sst deploy --stage=$ENVNAME --outputs-file ../../$STACKCONFIG_FILE


