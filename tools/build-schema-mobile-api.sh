#!/bin/bash
set -e
IFS='|'

STAGE=$1
MODE=$2
echo STAGE=$STAGE

if [[ $MODE = 'local' ]]
then
  echo MODE IS LOCAL
else
  echo MODE IS REMOTE
fi

APPID=$(amplify env get --name ${STAGE} --json | jq -r '.awscloudformation.AmplifyAppId')
echo APPID=$APPID

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
echo APINAME=$APINAME

cd ../..

echo 'Copy ANYUPP schema...'
echo '====================='
cp libs/anyupp-gql/backend/src/graphql/schema/anyupp-api.graphql apps/anyupp-mobile/graphql/anyupp-api-schema.graphql
# ln -s libs/anyupp-gql/backend/src/graphql/schema/anyupp-api.graphql apps/anyupp-mobile/graphql/anyupp-api-schema.graphql 
echo 'Done.'

# echo 'Print crud-backend app directory...'
# echo '==================================='
# ls -R apps/crud-backend | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /' -e 's/-/|/'

# echo 'Print crud-backend app files, searching for schema.graphql...'
# echo '============================================================='
# find apps/crud-backend/amplify/backend/api -name *.graphql

echo 'Copy and merge CRUD schema...'
echo '=============================='
cat apps/crud-backend/amplify/backend/api/${APINAME}/build/schema.graphql libs/gql-sdk/src/schema/aws.graphql > apps/anyupp-mobile/graphql/crud-api-schema.graphql
echo 'Done.'

echo 'Generating Dart models from schema...'
echo '===================================='
if [[ $MODE = 'local' ]]
then
    echo 'Build Mobile schema in local mode'
    yarn nx pub-get-local anyupp-mobile
    yarn nx graphql-codegen-local anyupp-mobile
elif [[ $STAGING = 'prod' ]]
then
    echo 'Build Mobile schema in docker container in PROD'
    yarn nx pub-get-prod anyupp-mobile
    yarn nx graphql-codegen-ci-prod anyupp-mobile
else
    echo 'Build Mobile schema in docker container'
    yarn nx pub-get anyupp-mobile
    yarn nx graphql-codegen-ci anyupp-mobile
fi
echo 'Done.'

#echo 'Removing temporary schema files...'
#echo '===================================='
#rm apps/anyupp-mobile/graphql/anyupp-api-schema.graphql
#rm apps/anyupp-mobile/graphql/crud-api-schema.graphql
#echo 'Done.'
