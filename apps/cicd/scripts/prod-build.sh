#!/bin/bash
set -e

APPNAME=$1
CI=$2

./tools/build-workspace.sh $ENVNAME $CI
yarn nx deploy crud-backend --env=${ENVNAME}
yarn nx deploy anyupp-backend --env=${ENVNAME}
yarn nx buildApk-ci anyupp-mobile

npx cowsay "PROJECT BUILD OK!!!"
