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
elif [ $STAGE = 'prod'  ] && [ $PLATFORM = 'android' ]; then
  appId="AnyUpp-Android-PROD"
else
  echo "Unsupported app: ${STAGE}/${PLATFORM}"
  exit 1
fi

echo "Trigger app build in stage ${STAGE}, platform ${PLATFORM}"
appcenter build queue -b ${STAGE} -a "Bitgap/${appId}" --token $APP_CENTER_TOKEN

