#!/bin/bash
set -e

ENVNAME=$1
CI=$2

./tools/build-workspace.sh $ENVNAME $CI
yarn nx deploy common-backend --env=${ENVNAME}
yarn nx deploy crud-backend --env=${ENVNAME}
yarn nx deploy anyupp-backend --env=${ENVNAME}
yarn deleteAllTableData
yarn seed
yarn nx buildAppbundle-ci anyupp-mobile

npx cowsay "PROJECT BUILD OK!!!"
