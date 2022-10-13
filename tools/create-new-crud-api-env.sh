#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
APPNAME=${ENVNAME}-anyupp-backend
EDITORNAME=${EDITORNAME:-vim}
AWS_PROFILE=${AWS_PROFILE:-default}

AWSCLOUDFORMATION="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${AWS_PROFILE}\"\
}"

AMPLIFY="{\
\"envName\":\"${ENVNAME}\",\
\"defaultEditor\":\"${EDITORNAME}\"\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATION\
}"


echo "aws ssm get-parameter --name "/${APPNAME}/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value'"

USERPOOLID=$(aws ssm get-parameter --name "/${APPNAME}/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value')
echo "USERPOOLID=$USERPOOLID"

IDENTITYPOOLID=$(aws ssm get-parameter --name "/${APPNAME}/generated/IdentityPoolId" | \
  jq -r '.Parameter.Value')
echo "IDENTITYPOOLID=$IDENTITYPOOLID"

WEBCLIENTID=$(aws ssm get-parameter --name "/${APPNAME}/generated/AdminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')
echo "WEBCLIENTID=$WEBCLIENTID"

NATIVECLIENTID=$(aws ssm get-parameter --name "/${APPNAME}/generated/AdminNativeUserPoolClientId" | \
  jq -r '.Parameter.Value')
echo "NATIVECLIENTID=$NATIVECLIENTID"

AUTHCONFIG="{\
\"userPoolId\":\"$USERPOOLID\",\
\"identityPoolId\":\"$IDENTITYPOOLID\",\
\"webClientId\":\"$WEBCLIENTID\",\
\"nativeClientId\":\"$NATIVECLIENTID\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"

amplify env add \
--amplify $AMPLIFY \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes

amplify push --yes

APPID=$(amplify env get --name ${ENVNAME} --json | jq -r '.awscloudformation.AmplifyAppId')

X=$(aws ssm put-parameter \
  --type String \
  --overwrite \
  --value ${APPID} \
  --name "/${APPNAME}/generated/CrudApiAppId")

