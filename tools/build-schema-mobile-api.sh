#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
MODE=$2
echo ENVNAME=$ENVNAME

if [[ $MODE = 'ci' ]]
then
  echo RUnning in CI mode
fi

APPID=$(amplify env get --name ${ENVNAME} --json | jq -r '.awscloudformation.AmplifyAppId')
echo APPID=$APPID

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
echo APINAME=$APINAME

cd ../..

echo 'Copy and merge CRUD schema...'
echo '=============================='
cat \
  apps/crud-backend/amplify/backend/api/anyuppbackend/build/schema.graphql \
  libs/anyupp-schema/src/schema/aws.graphql \
  > apps/anyupp-mobile/graphql/crud-api-schema.graphql
echo 'Done.'

echo 'Generating Dart models from schema...'
echo '===================================='
if [[ $MODE = 'ci' ]]
then
  echo 'Build Mobile schema in docker container (CI mode)'
    yarn nx pub-get-ci anyupp-mobile
    yarn nx graphql-codegen-ci anyupp-mobile
else
    echo 'Build Mobile schema in development mode'
    yarn nx pub-get anyupp-mobile
    yarn nx graphql-codegen anyupp-mobile
fi

echo 'Done.'

