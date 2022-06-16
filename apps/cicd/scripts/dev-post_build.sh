#!/bin/bash
set -e

ENVNAME=$1
BUCKET_NAME=$2
ADMIN_SITE_URL=$3

./apps/cicd/scripts/common-post_build.sh $ENVNAME $BUCKET_NAME

npx cowsay "TESTING $ENVNAME..."

yarn alltest
yarn nx integration-test-ci anyupp-mobile
#yarn nx run anyupp-mobile:e2e-test-ci
yarn deleteAllTableData
yarn seed
#yarn nx e2e-remote admin-e2e --headless --baseUrl=$ADMIN_SITE_URL
yarn deleteAllTableData
# Reports are not generated. The next three lines are depending on the e2e test execution
#yarn seed
#yarn cucumber:report
#yarn cypress:generate:html:report

npx cowsay "$ENVNAME TESTING OK!!!"
