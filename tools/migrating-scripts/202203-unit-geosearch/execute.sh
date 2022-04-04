#!/bin/bash
set -e
IFS='|'

ENVNAME=$1

# Create geoindex in unit table and migrate the unit fields
yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./recreate-unit-index.ts

# Reindex the unit table
APPID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/CrudApiAppId" | \
  jq -r '.Parameter.Value')
echo "APPID=$APPID"

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
echo "APINAME=$APINAME"

METAFILE=apps/cicd/amplify/backend/amplify-meta.json
API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)
echo "API_ID=$API_ID"

TABLE_NAME=Unit-${API_ID}-${ENVNAME}
python3 tools/reindex-tables/ddb_to_es.py \
--rn $AWS_REGION \
--tn $TABLE_NAME \
--lf "arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT}:function:DdbToEsFn-${API_ID}-${ENVNAME}" \
--esarn "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT}:table/${TABLE_NAME}/stream"

