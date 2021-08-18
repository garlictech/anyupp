#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
LOCAL="${3:-remote}"

HYGEN_OVERWRITE=1 yarn hygen project configure --app=$APPNAME
time yarn nx config crud-backend --app=$APPNAME --stage=$STAGE
time yarn nx config shared-config --app=$APPNAME --stage=$STAGE
time yarn nx build-schema anyupp-gql-api
time yarn nx build-schema crud-backend --app=$APPNAME --stage=$STAGE

# Added mobile schema generation here
time yarn nx build-schema anyupp-mobile --stage=$STAGE --mode=$LOCAL


if [ $STAGE = 'dev' ]; then
  time yarn nx build admin --skip-nx-cache
elif [ $STAGE = 'prod' ]; then
  time yarn nx build admin --configuration=production --skip-nx-cache
else
  time yarn nx build admin --configuration=$STAGE --skip-nx-cache
fi

time yarn nx build anyupp-backend --app=$APPNAME --stage=$STAGE --skip-nx-cache
