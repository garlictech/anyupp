#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
MODE="${2:-ci}"

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com

yarn nx config crud-backend --env=$ENVNAME --skip-nx-cache
yarn nx run-many --target=config --all --skip-nx-cache --exclude=crud-backend --env=$ENVNAME
yarn nx run-many --target=build --projects=crud-backend,anyupp-global,anyupp-backend,anyupp-mobile --env=$ENVNAME --mode=$MODE --skip-nx-cache

if [ $MODE = 'ci' ]; then
  yarn nx run-many --target=build-ci --projects=variants-manager-site --skip-nx-cache
else
  yarn nx run-many --target=build --projects=variants-manager-site --skip-nx-cache
fi

if [ $ENVNAME = 'dev' ]; then
  yarn nx build admin --skip-nx-cache
elif [ $ENVNAME = 'prod' ]; then
  yarn nx build admin --configuration=production --skip-nx-cache 
elif [ $ENVNAME = 'qa' ] || [ $ENVNAME = 'staging' ]; then
  yarn nx build admin --configuration=$ENVNAME --skip-nx-cache
else
  yarn nx build admin --skip-nx-cache
fi
