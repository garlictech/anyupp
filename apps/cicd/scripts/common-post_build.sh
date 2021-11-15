#!/bin/bash
set -e

STAGE=$1
BUCKET_NAME=$2

tar -cvf ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz \
  apps/anyupp-mobile/lib/awsconfiguration.dart \
  apps/anyupp-mobile/graphql/crud-api-schema.graphql \
  apps/anyupp-mobile/lib/graphql/generated

aws s3 cp ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz s3://$BUCKET_NAME/

echo 'Pushing Android AAB to appcenter'
./tools/publish-to-appcenter.sh ${STAGE} android

echo 'Triggering ios app build in appcenter...'
./tools/trigger-appcenter-builds.sh ${STAGE} ios

npx cowsay "$STAGE DEPLOYMENT OK!!!"
