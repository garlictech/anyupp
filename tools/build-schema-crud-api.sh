#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
APPNAME=anyuppbackend

echo 'Copy CRUD schema...'
echo '=============================='

cp ../../libs/anyupp-schema/src/schema/crud-api.graphql \
  amplify/backend/api/$APPNAME/schema.graphql

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/\${env}/${ENVNAME}/g" amplify/backend/api/$APPNAME/schema.graphql
else
  sed -i "s/\${env}/${ENVNAME}/g" amplify/backend/api/$APPNAME/schema.graphql
fi

echo
echo 'Compile schema with amplify'
echo '=============================='
amplify api gql-compile --allow-destructive-graphql-schema-updates
#amplify api gql-compile
amplify codegen

echo
echo 'Generate typescript api'
echo '=============================='
yarn graphql-codegen --config tools/graphql-codegen-crud.yml
# Remove this duplication of files
mkdir -p ../../libs/domain/src/lib/entities/generated
cp ../../libs/crud-gql/api/src/lib/generated/api.ts ../../libs/domain/src/lib/entities/generated/api.ts
echo 'Done.'

echo "Preparing schema for graphql schema checker..."
cat ../../libs/anyupp-schema/src/schema/aws.graphql \
  ../../apps/crud-backend/amplify/backend/api/anyuppbackend/build/schema.graphql \
  > ../../.github/graphql-inspector-artifacts/schema.graphql

cp ../../libs/crud-gql/api/src/lib/generated/api.ts ../../libs/domain/src/lib/entities/generated
