#!/bin/bash
set -e
IFS='|'

STAGE=$1

APPID=$(amplify env get --name ${STAGE} --json | \
  jq -r '.awscloudformation.AmplifyAppId')

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")

cp ../../libs/crud-gql/backend/src/graphql/crud-api.graphql amplify/backend/api/$APINAME/schema.graphql
amplify api gql-compile
amplify codegen
yarn graphql-codegen --config tools/graphql-codegen-crud.yml

