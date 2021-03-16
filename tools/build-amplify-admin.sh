#!/bin/bash
set -e
IFS='|'

STAGE=$1

APPID=$(amplify env get --name ${STAGE} --json | \
  jq -r '.awscloudformation.AmplifyAppId')

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")\

cp ../../libs/api/graphql/schema/src/schema/admin-api.graphql amplify/backend/api/$APINAME/schema.graphql
amplify codegen

