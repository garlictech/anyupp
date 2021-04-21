#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2

nx config crud-backend --app=$APPNAME --stage=$STAGE
nx config shared-config --app=$APPNAME --stage=$STAGE
nx build anyupp-gql-api --skip-nx-cache
nx build-schema crud-backend --app=$APPNAME --stage=$STAGE
nx build-schema crud-backend --app=$APPNAME --stage=$STAGE
nx build anyupp-backend --app=$APPNAME --stage=$STAGE --skip-nx-cache

if [ $STAGE = 'dev' ]; then
  nx build admin
else
  nx build admin --configuration=$STAGE --skip-nx-cache
fi

