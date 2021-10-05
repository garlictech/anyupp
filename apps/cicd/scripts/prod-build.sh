#!/bin/bash
set -e

ENVNAME=$1
CI=$2

# This is temporary solution!
rm -rf apps/crud-backend/amplify
./tools/build-workspace.sh $ENVNAME $CI
yarn nx deploy crud-backend --env=${ENVNAME}
yarn nx deploy anyupp-backend --env=${ENVNAME}
yarn nx buildApk-ci anyupp-mobile

npx cowsay "PROJECT BUILD OK!!!"
