#!/bin/bash
set -e
IFS='|'

APPNAME=$1
STAGE=$2
EDITORNAME=${EDITORNAME:-vim}
AWS_PROFILE=${AWS_PROFILE:-default}

AWSCLOUDFORMATION="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"${AWS_PROFILE}\"\
}"

AMPLIFY="{\
\"projectName\":\"$APPNAME\",\
\"envName\":\"${STAGE}\",\
\"defaultEditor\":\"${EDITORNAME}\"\
}"

FRONTENDCONFIG="{\
\"SourceDir\":\"../../libs/crud-gql/api/src/lib/generated\",\
\"DistributionDir\":\"../../dist/apps/admin\",\
\"BuildCommand\":\"yarn nx build admin\",\
\"StartCommand\":\"yarn nx serve admin\"\
}"

FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"none\",\
\"config\":$FRONTENDCONFIG\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATION\
}"

rm -rf amplify
echo "Existing Amplify app folder deleted."

X=$(amplify init \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--yes
)

APPID=$(amplify env get --name ${STAGE} --json | jq -r '.awscloudformation.AmplifyAppId')

X=$(aws ssm put-parameter \
  --type String \
  --overwrite \
  --value ${APPID} \
  --name "/${STAGE}-${APPNAME}/generated/CrudApiAppId")
