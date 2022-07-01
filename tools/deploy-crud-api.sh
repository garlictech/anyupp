#!/bin/bash
set -e
IFS='|'

export AWS_PAGER=""

ENVNAME=$1
APPNAME=${ENVNAME}-anyupp-backend

amplify push --yes

APPID=$(amplify env get --name ${ENVNAME} --json | \
  jq -r '.awscloudformation.AmplifyAppId')

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
METAFILE=amplify/backend/amplify-meta.json
API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)

OS_ENDPOINT=$(aws cloudformation list-exports | \
  jq ".Exports[] | select(.Name == \"$API_ID:GetAtt:OpenSearch:DomainEndpoint\")" | \
  jq ".Value")

CRUD_CONFIG_FILE=../../libs/crud-gql/api/src/lib/generated/crud-api-config.ts

printf "Generating ${CRUD_CONFIG_FILE}...\n"

echo "
export const CrudApiConfig = {
  appId: '${APPID}',
  appsyncApiId: '${API_ID}',
  openSearchEndpoint: ${OS_ENDPOINT},
  openSearchArn: ${OS_ARN}
}
" > ${CRUD_CONFIG_FILE}

cat $CRUD_CONFIG_FILE

X=$(aws ssm put-parameter \
  --type String \
  --overwrite \
  --value ${APPID} \
  --name "/${APPNAME}/generated/CrudApiAppId")

rm -f libs/crud-gql/api/src/lib/generated/api.ts
yarn graphql-codegen --config tools/graphql-codegen-crud.yml

# ----------------------------------------------------------
# Post-processing the result
# ----------------------------------------------------------
rm -f  ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts
mv -f ../../libs/crud-gql/api/src/lib/generated/aws-exports.js ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts
