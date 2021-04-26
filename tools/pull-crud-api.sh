#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
EDITORNAME=${EDITORNAME:-vim}
AWS_PROFILE=${AWS_PROFILE:-default}

APPID=$(aws ssm get-parameter --name "/${STAGE}-${APPNAME}/generated/CrudApiAppId" | \
  jq -r '.Parameter.Value')

USERPOOLID=$(aws ssm get-parameter --name "/${STAGE}-${APPNAME}/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value')

IDENTITYPOOLID=$(aws ssm get-parameter --name "/${STAGE}-${APPNAME}/generated/IdentityPoolId" | \
  jq -r '.Parameter.Value')

WEBCLIENTID=$(aws ssm get-parameter --name "/${STAGE}-${APPNAME}/generated/AdminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')

NATIVECLIENTID=$(aws ssm get-parameter --name "/${STAGE}-${APPNAME}/generated/AdminNativeUserPoolClientId" | \
  jq -r '.Parameter.Value')

ANGULARconfig="{\
\"SourceDir\":\"../../libs/crud-gql/api/src/lib/generated\",\
\"DistributionDir\":\"../../dist/apps/admin\",\
\"BuildCommand\":\"yarn nx build admin\",\
\"StartCommand\":\"yarn nx serve admin\"\
}"

AUTHconfig="{\
\"userPoolId\":\"$USERPOOLID\",\
\"identityPoolId\":\"$IDENTITYPOOLID\",\
\"webClientId\":\"$WEBCLIENTID\",\
\"nativeClientId\":\"$NATIVECLIENTID\"\
}"

AWSCLOUDFORMATIONconfig="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${AWS_PROFILE}\"\
}"

AMPLIFY="{\
\"projectName\":\"amplifyadmin\",\
\"appId\":\"$APPID\",\
\"envName\":\"${STAGE}\",\
\"defaultEditor\":\"${EDITORNAME}\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"none\",\
\"config\":$ANGULARconfig\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONconfig\
}"

CODEGEN="{\
\"generateCode\":true,\
\"codeLanguage\":\"javascript\",\
\"fileNamePattern\":\"../../libs/crud-gql/api/src/lib/generated/graphql/**/*.ts\",\
\"generatedFileName\":\"../../libs/crud-gql/api/src/lib/generated/api.ts\",\
\"maxDepth\":10,\
\"generateDocs\":true\
}"

CATEGORIES="{\
\"auth\":$AUTHconfig\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes

amplify codegen

# ----------------------------------------------------------
# Get the CRUD table config and write it to a generated file
# ----------------------------------------------------------
echo "Generating table config..."
TABLE_CONFIG_DIR='../../libs/crud-gql/backend/src/generated'
mkdir -p $TABLE_CONFIG_DIR
TABLE_CONFIG_NAME="$TABLE_CONFIG_DIR/table-config.json"

APPID=$(amplify env get --name ${STAGE} --json | \
  jq -r '.awscloudformation.AmplifyAppId')

APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")

METAFILE=amplify/backend/amplify-meta.json
API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)

DATA_SOURCES=$(aws appsync list-data-sources --api-id $API_ID | \
  jq '.dataSources' | \
  jq '.[] | select(.type == "AMAZON_DYNAMODB")')

TABLE_NAMES=$(echo $DATA_SOURCES | jq ".dynamodbConfig.tableName" | tr -d '"')
IFS=$'\n'
RESULT="{\n"

for name in $TABLE_NAMES; do
  RESULT+="  \"$(cut -d '-' -f 1 <<< "$name" )\": \"$name\",\n"
done

RESULT+="}"

echo $RESULT | sed 'x;${s/,$//;p;x;};1d' > ${TABLE_CONFIG_NAME}

echo "Table config generated in $PWD/$TABLE_CONFIG_NAME"

echo "Content:"
cat $TABLE_CONFIG_NAME
