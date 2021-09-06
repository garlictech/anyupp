#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
MODE="${3:-ci}"

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com

HYGEN_OVERWRITE=1 yarn hygen project configure --app=$APPNAME
yarn nx config crud-backend --app=$APPNAME --stage=$STAGE
yarn nx config shared-config --app=$APPNAME --stage=$STAGE
yarn nx build-schema anyupp-gql-api
yarn nx build-schema crud-backend --app=$APPNAME --stage=$STAGE

# Added mobile schema generation here
yarn nx build-schema anyupp-mobile --stage=$STAGE --mode=$MODE


if [ $STAGE = 'dev' ]; then
  yarn nx build admin --skip-nx-cache
elif [ $STAGE = 'prod' ]; then
  yarn nx build admin --configuration=production --skip-nx-cache
else
  yarn nx build admin --configuration=$STAGE --skip-nx-cache
fi

yarn nx build anyupp-backend --app=$APPNAME --stage=$STAGE --skip-nx-cache
