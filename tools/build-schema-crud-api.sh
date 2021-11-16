#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
APPNAME=anyuppbackend

echo 'Copy CRUD schema...'
echo '=============================='
cp ../../libs/crud-gql/backend/src/graphql/schema/crud-api.graphql \
  amplify/backend/api/$APPNAME/schema.graphql

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

echo "Preparing schema for graphql schema checker..."
cat ../../libs/gql-sdk/src/schema/aws.graphql \
  ../../apps/crud-backend/amplify/backend/api/anyuppbackend/build/schema.graphql \
  > ../../.github/graphql-inspector-artifacts/schema.graphql

