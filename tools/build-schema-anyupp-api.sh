#!/bin/bash
set -e
IFS='|'

echo 'Copy and merge ANYUPP schema...'
echo '=============================='
mkdir -p ../../libs/anyupp-gql/backend/src/graphql/schema/generated
cat \
  ../../libs/gql-sdk/src/schema/aws.graphql \
  ../../libs/gql-sdk/src/schema/shared.graphql \
  ../../libs/anyupp-gql/backend/src/graphql/schema/anyupp-api.graphql | \
# Remove the not known directives
sed 's/@model//g' | \
sed 's/@searchable//g' | \
sed 's/@auth(.*)//g' > ../../libs/anyupp-gql/backend/src/graphql/schema/generated/schema.graphql
echo 'Done.'

echo
echo 'Generate typescript api'
echo '=============================='
yarn graphql-codegen --config tools/graphql-codegen-anyupp.yml
echo 'Done.'

