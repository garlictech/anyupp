#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
FUNCTION_NAME=$2 # like amplify-anyuppbackend-sta-OpenSearchStreamingLambd-iNsDbhVYGANu

if [ -z "$FUNCTION_NAME" ]
then
   echo
   echo "HELLOBELLO! Usage example: execute.sh zsoltstack amplify-anyuppbackend-sta-OpenSearchStreamingLambd-iNsDbhVYGANu"
   echo
   echo "Find a lambda contianing OpenSearchStreamingLambd string in your sandbox then use it as second parameter."
   echo
   exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Create geoindex in unit table and migrate the unit fields
yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register \
  ${SCRIPT_DIR}/recreate-unit-index.ts

# Reindex the unit table
APPID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/CrudApiAppId" | \
  jq -r '.Parameter.Value')
echo "APPID=$APPID"

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
echo "APINAME=$APINAME"

METAFILE=apps/crud-backend/amplify/backend/amplify-meta.json
API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)
echo "API_ID=$API_ID"

TABLE_NAME=Unit-${API_ID}-${ENVNAME}
  python3 tools/reindex-tables/ddb_to_es.py \
  --rn $AWS_REGION \
  --tn $TABLE_NAME \
  --lf "arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT}:function:${FUNCTION_NAME}" \
  --esarn "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT}:table/${name}/stream"

