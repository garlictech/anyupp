#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
EDITORNAME=${EDITORNAME:-vim}

APPID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}-AdminAmplifyAppId" | \
  jq -r '.Parameter.Value')

USERPOOLID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}-adminUserPoolId" | \
  jq -r '.Parameter.Value')

WEBCLIENTID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}-adminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')

NATIVECLIENTID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}-adminNativeUserPoolClientId" | \
  jq -r '.Parameter.Value')

ANGULARCONFIG="{\
\"SourceDir\":\"../../libs/admin/amplify-api/src/lib/generated\",\
\"DistributionDir\":\"../../dist/apps/admin\",\
\"BuildCommand\":\"yarn nx build admin\",\
\"StartCommand\":\"yarn nx serve admin\"\
}"

AUTHCONFIG="{\
\"userPoolId\":\"$USERPOOLID\",\
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
\"envName\":\"${STAGE}\",\
\"defaultEditor\":\"${EDITORNAME}\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"angular\",\
\"config\":$ANGULARCONFIG\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

CODEGEN="{\
\"generateCode\":true,\
\"codeLanguage\":\"javascript\",\
\"fileNamePattern\":\"../../libs/admin/amplify-api/src/lib/generated/graphql/**/*.ts\",\
\"generatedFileName\":\"../../libs/admin/amplify-api/src/lib/generated/api.ts\",\
\"maxDepth\":10,\
\"generateDocs\":true\
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

amplify codegen
amplify codegen model

