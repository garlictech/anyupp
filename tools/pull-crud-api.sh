#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
EDITORNAME=${EDITORNAME:-vim}
AWS_PROFILE=${AWS_PROFILE:-default}

APPID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/CrudApiAppId" | \
  jq -r '.Parameter.Value')

USERPOOLID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/adminUserPoolId" | \
  jq -r '.Parameter.Value')

IDENTITYPOOLID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/IdentityPoolId" | \
  jq -r '.Parameter.Value')

WEBCLIENTID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/adminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')

NATIVECLIENTID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/adminNativeUserPoolClientId" | \
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
\"framework\":\"angular\",\
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
