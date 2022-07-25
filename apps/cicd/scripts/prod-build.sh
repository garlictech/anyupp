#!/bin/bash
set -e

ENVNAME=$1
CI=$2

rm -rf apps/crud-backend/amplify
./tools/build-workspace.sh $ENVNAME $CI


if [ "$ENVNAME" = "prod" ]; then
  yarn nx deploy common-backend --env=${ENVNAME}
fi

yarn nx deploy crud-backend --env=${ENVNAME}
yarn nx deploy anyupp-global --env=${ENVNAME}
yarn nx deploy anyupp-backend --env=${ENVNAME}
yarn nx buildAppbundle-ci anyupp-mobile

npx cowsay "PROJECT BUILD OK!!!"
