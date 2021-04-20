#!/bin/bash
set -e
IFS='|'

STAGE=$1
PLATFORM=$2

if [ $PLATFORM = 'android' ]; then
  appImagePath=${CODEBUILD_SRC_DIR:-$PWD}/apps/anyupp-mobile/build/app/outputs/flutter-apk/app-release.apk
else
  echo "Unsupported platform: ${PLATFORM}"
  exit 1
fi

if [ $STAGE = 'dev' ]; then
  appId="3FA-1"
elif [ $STAGE = 'qa' ]; then
  appId="AnyUpp-Android-QA"
elif [ $STAGE = 'prod' ]; then
  appId="AnyUpp-Android-PROD"
else
  echo "Unsupported stage: ${STAGE}"
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
