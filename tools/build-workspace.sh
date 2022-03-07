#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
MODE="${2:-ci}"

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com

yarn nx config crud-backend --env=$ENVNAME
yarn nx config shared-config --env=$ENVNAME
yarn nx config anyupp-backend --env=$ENVNAME
yarn nx build-schema crud-backend --env=$ENVNAME

# Added mobile schema generation here
yarn nx build-schema anyupp-mobile --env=$ENVNAME --mode=$MODE


if [ $ENVNAME = 'dev' ]; then
  yarn nx build admin --skip-nx-cache
elif [ $ENVNAME = 'prod' ]; then
  yarn nx build admin --configuration=production --skip-nx-cache
elif [ $ENVNAME = 'qa' ] || [ $ENVNAME = 'staging' ]; then
  yarn nx build admin --configuration=$ENVNAME --skip-nx-cache
else
  yarn nx build admin --skip-nx-cache
fi

yarn nx build anyupp-backend --env=$ENVNAME --skip-nx-cache
