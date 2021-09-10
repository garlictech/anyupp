#!/bin/bash
set -e

ENVNAME=$1
BUCKET_NAME=$2
ADMIN_SITE_URL=$3

./apps/cicd/scripts/common-post_build.sh $ENVNAME $BUCKET_NAME

npx cowsay "TESTING $ENVNAME..."

yarn nx test integration-tests-universal --codeCoverage --coverageReporters=clover
yarn nx test integration-tests-angular --codeCoverage --coverageReporters=clover
yarn nx run anyupp-mobile:integration-test-ci
yarn deleteAllTableData
yarn seed
yarn nx e2e-remote admin-e2e --headless --baseUrl=$ADMIN_SITE_URL
yarn deleteAllTableData
yarn seed
yarn cucumber:report
yarn cypress:generate:html:report

npx cowsay "$ENVNAME TESTING OK!!!"
