#!/bin/bash
set -e

APPNAME=$1
STAGE=$2
CI=$3

./tools/build-workspace.sh $APPNAME $STAGE $CI
yarn nx deploy crud-backend --stage=${STAGE} --app=${APPNAME}
yarn nx deploy anyupp-backend --stage=${STAGE} --app=${APPNAME}
yarn deleteAllTableData
yarn seed
yarn nx buildApk-ci anyupp-mobile

npx cowsay "PROJECT BUILD OK!!!"
