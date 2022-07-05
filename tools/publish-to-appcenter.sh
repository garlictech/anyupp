#!/bin/bash
set -e
IFS='|'

STAGE=$1
PLATFORM=$2

if [ $STAGE = 'dev'  ] && [ $PLATFORM = 'ios' ]; then
  appId="3FA"
elif [ $STAGE = 'qa'  ] && [ $PLATFORM = 'ios' ]; then
  appId="AnyUpp-iOS-QA"
elif [ $STAGE = 'dev'  ] && [ $PLATFORM = 'android' ]; then
  appId="3FA-1"
elif [ $STAGE = 'qa'  ] && [ $PLATFORM = 'android' ]; then
  appId="AnyUpp-Android-QA"
elif [ $STAGE = 'staging'  ] && [ $PLATFORM = 'ios' ]; then
  appId="AnyUpp-iOS-Staging"
elif [ $STAGE = 'staging'  ] && [ $PLATFORM = 'android' ]; then
  appId="AnyUpp-Android-Staging"
elif [ $STAGE = 'prod'  ] && [ $PLATFORM = 'ios' ]; then
  appId="AnyUpp-iOS-PROD"
elif [ $STAGE = 'prod'  ] && [ $PLATFORM = 'android' ]; then
  appId="AnyUpp-Android-PROD"
elif [ $STAGE = 'test' ] && [ $PLATFORM = 'android' ]; then
  appId="AnyUpp-Android-Test"
elif [ $STAGE = 'test' ] && [ $PLATFORM = 'ios' ]; then
  appId="AnyUpp-iOS-Test"
else
  echo "Unsupported app: ${STAGE}/${PLATFORM}"
  exit 1
fi

if [ $PLATFORM = 'android' ]; then
  appImagePath=${CODEBUILD_SRC_DIR:-$PWD}/apps/anyupp-mobile/build/app/outputs/bundle/release/app-release.aab
else
  echo "Unsupported platform: ${PLATFORM}"
  exit 1
fi

if [[ -z ${appImagePath} ]]
then
    echo "No app image were found at ${appImagePath}, skip publishing to App Center"
    exit 1
fi

echo "Publishing to stage ${STAGE}, platform ${PLATFORM}"
echo "Using image at $appImagePath"

appcenter distribute release \
    --group Collaborators \
    --file "${appImagePath}" \
    --release-notes 'App submission via AWS CodePipeline' \
    --app "Bitgap/${appId}" \
    --token "${APP_CENTER_TOKEN}" \
    --quiet
