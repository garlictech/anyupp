#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
MODE="${2:-ci}"

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com

yarn nx run-many --target=config --all --skip-nx-cache --env=$ENVNAME
yarn nx run-many --target=build --projects=crud-backend,anyupp-global,anyupp-backend,anyupp-mobile --env=$ENVNAME --mode=$MODE

if [ $MODE = 'ci' ]; then
  yarn nx run-many --target=build-ci --projects=variants-manager-site
else
  yarn nx run-many --target=build --projects=variants-manager-site
fi

if [ $ENVNAME = 'dev' ]; then
  yarn nx build admin
elif [ $ENVNAME = 'prod' ]; then
  yarn nx build admin --configuration=production 
elif [ $ENVNAME = 'qa' ] || [ $ENVNAME = 'staging' ]; then
  yarn nx build admin --configuration=$ENVNAME
else
  yarn nx build admin
fi
