#!/bin/bash
set -e

ENVNAME=$1
BUCKET_NAME=$2
APPNAME=anyupp-backend

#pushd apps/anyupp-backend
#yarn sst remove $ENVNAME-$APPNAME-configurator --stage=$ENVNAME
#popd

#tar -cvf ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz \
#  apps/anyupp-mobile/lib/awsconfiguration.dart \
#  apps/anyupp-mobile/graphql/crud-api-schema.graphql \
#  apps/anyupp-mobile/lib/graphql/generated
#
#aws s3 cp ${CODEBUILD_RESOLVED_SOURCE_VERSION}.tgz s3://$BUCKET_NAME/
#
#echo 'Pushing Android AAB to appcenter'
#./tools/publish-to-appcenter.sh ${ENVNAME} android
#
#echo 'Triggering ios app build in appcenter...'
#./tools/trigger-appcenter-builds.sh ${ENVNAME} ios

npx cowsay "$ENVNAME DEPLOYMENT OK!!!"
