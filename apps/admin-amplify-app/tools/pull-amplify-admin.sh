#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
EDITORNAME=${EDITORNAME:-vim}

ANGULARCONFIG="{\
\"SourceDir\":\"../..libs/admin/amplify/src/lib\",\
\"DistributionDir\":\"../../dist/apps/admin\",\
\"BuildCommand\":\"yarn nx build admin\",\
\"StartCommand\":\"yarn nx serve admin\"\
}"

AUTHCONFIG="{\
\"userPoolId\":\"eu-west-1_uQinis9TS\",\
\"webClientId\":\"4hq082sd8sngpd5ei6gueh2h7s\",\
\"nativeClientId\":\"4te6am9eoaq6e3ve904e3ftft3\"\
}"

APICONFIG="{\
}"

AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${AWS_PROFILE}\"\
}"

AMPLIFY="{\
\"projectName\":\"amplifyadmin\",\
\"appId\":\"d3g450anapuh1j\",\
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
\"fileNamePattern\":\"../..libs/admin/amplify/src/lib/graphql/**/*.js\",\
\"generatedFileName\":\"API\",\
\"maxDepth\":10,\
\"generateDocs\":true\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG,\
\"codegen\":$CODEGEN\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes

amplify codegen
amplify codegen models

