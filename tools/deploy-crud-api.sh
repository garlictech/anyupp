#!/bin/bash
set -e
IFS='|'

export AWS_PAGER=""

APPNAME=$1
STAGE=$2

amplify push --yes

APPID=$(amplify env get --name ${STAGE} --json | \
  jq -r '.awscloudformation.AmplifyAppId')

X=$(aws ssm put-parameter \
  --type String \
  --overwrite \
  --value ${APPID} \
  --name "/${STAGE}-${APPNAME}/generated/CrudApiAppId")

rm -f libs/crud-gql/api/src/lib/generated/api.ts
yarn graphql-codegen --config tools/graphql-codegen-crud.yml

# ----------------------------------------------------------
# Post-processing the result
# ----------------------------------------------------------
rm -f  ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts
mv -f ../../libs/crud-gql/api/src/lib/generated/aws-exports.js ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts
