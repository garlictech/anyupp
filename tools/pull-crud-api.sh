#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
EDITORNAME=${EDITORNAME:-vim}
AWS_PROFILE=${AWS_PROFILE:-default}
echo "ENVNAME=$ENVNAME"
echo "EDITORNAME=$EDITORNAME"
echo "AWS_PROFILE=$AWS_PROFILE"

APPID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/CrudApiAppId" | \
  jq -r '.Parameter.Value')
echo "APPID=$APPID"

USERPOOLID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value')
echo "USERPOOLID=$USERPOOLID"

IDENTITYPOOLID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/IdentityPoolId" | \
  jq -r '.Parameter.Value')
echo "IDENTITYPOOLID=$IDENTITYPOOLID"

WEBCLIENTID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/AdminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')
echo "WEBCLIENTID=$WEBCLIENTID"

NATIVECLIENTID=$(aws ssm get-parameter --name "/${ENVNAME}-anyupp-backend/generated/AdminNativeUserPoolClientId" | \
  jq -r '.Parameter.Value')
echo "NATIVECLIENTID=$NATIVECLIENTID"

ANGULARCONFIG="{\
\"SourceDir\":\"../../libs/crud-gql/api/src/lib/generated\",\
\"DistributionDir\":\"../../dist/apps/admin\",\
\"BuildCommand\":\"yarn nx build admin\",\
\"StartCommand\":\"yarn nx serve admin\"\
}"

AUTHCONFIG="{\
\"userPoolId\":\"$USERPOOLID\",\
\"identityPoolId\":\"$IDENTITYPOOLID\",\
\"webClientId\":\"$WEBCLIENTID\",\
\"nativeClientId\":\"$NATIVECLIENTID\"\
}"

AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${AWS_PROFILE}\"\
}"

AMPLIFY="{\
\"projectName\":\"amplifyadmin\",\
\"appId\":\"$APPID\",\
\"envName\":\"${ENVNAME}\",\
\"defaultEditor\":\"${EDITORNAME}\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"none\",\
\"config\":$ANGULARCONFIG\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes

amplify env checkout $ENVNAME

# ----------------------------------------------------------
# Get the CRUD table config and write it to a generated file
# ----------------------------------------------------------
echo "Generating table config..."
CRUD_CONFIG_DIR='../../libs/crud-gql/backend/src/generated'
mkdir -p $CRUD_CONFIG_DIR
TABLE_CONFIG_NAME="$CRUD_CONFIG_DIR/table-config.json"

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
echo "APINAME=$APINAME"

METAFILE=amplify/backend/amplify-meta.json
API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)
echo "API_ID=$API_ID"

DATA_SOURCES=$(aws appsync list-data-sources --api-id $API_ID | \
  jq ".dataSources" | \
  jq ".[] | select(.type == \"AMAZON_DYNAMODB\")")

TABLE_NAMES=$(echo $DATA_SOURCES | jq ".dynamodbConfig.tableName" | tr -d '"')
IFS=$'\n'
RESULT="{"

for name in $TABLE_NAMES; do
  RESULT+="  \"$(cut -d '-' -f 1 <<< "$name" )\":"
  TABLE_INFO=$(aws dynamodb describe-table --table-name $name --output json | jq "{TableArn: .Table.TableArn, TableName: .Table.TableName, LatestStreamArn: .Table.LatestStreamArn}")
  RESULT+="  $TABLE_INFO,"
done

# On the CI the SED is not working so this CLOSING TAG is a workaround
RESULT+="\"_closing_tag\": \"dont use me\"}"
echo $RESULT > ${TABLE_CONFIG_NAME}

OS_ENDPOINT=$(aws cloudformation list-exports | \
  jq ".Exports[] | select(.Name == \"$API_ID:GetAtt:OpenSearch:DomainEndpoint\")" | \
  jq ".Value")

echo "Table config generated in $PWD/$TABLE_CONFIG_NAME"

# ----------------------------------------------------------
# Generate crud config
# ----------------------------------------------------------
CRUD_CONFIG_FILE=../../libs/crud-gql/api/src/lib/generated/crud-api-config.ts

printf "Generating ${CRUD_CONFIG_FILE}...\n"

echo "
export const CrudApiConfig = {
  appId: '${APPID}',
  appsyncApiId: '${API_ID}',
  openSearchEndpoint: ${OS_ENDPOINT}
}
" > ${CRUD_CONFIG_FILE}

# ----------------------------------------------------------
# Post-processing the result
# ----------------------------------------------------------
rm -f  ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts
mv -f ../../libs/crud-gql/api/src/lib/generated/aws-exports.js ../../libs/crud-gql/api/src/lib/generated/aws-exports.ts

# ----------------------------------------------------------
# Generate global config
# ----------------------------------------------------------
pushd ../.. 
yarn ts-node ./tools/fetch-configuration.ts $ENVNAME
popd
