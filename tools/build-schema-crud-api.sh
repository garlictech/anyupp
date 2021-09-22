#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
APPNAME=anyuppbackend

echo 'Copy and merge CRUD schema...'
echo '=============================='
cat \
  ../../libs/crud-gql/backend/src/graphql/schema/crud-api.graphql \
  ../../libs/gql-sdk/src/schema/shared.graphql \
  > amplify/backend/api/$APPNAME/schema.graphql
echo 'Done.'

echo
echo 'Compile schema with amplify'
echo '=============================='

amplify api gql-compile
amplify codegen

echo
echo 'Generate typescript api'
echo '=============================='
yarn graphql-codegen --config tools/graphql-codegen-crud.yml
echo 'Done.'

