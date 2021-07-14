#!/bin/bash
set -e

APPNAME=$1
STAGE=$2

generatedLibExcludes="--exclude=shared-config --exclude=anyupp-gql-api --exclude=crud-gql-api"

time ./tools/build-workspace.sh ${APPNAME} ${STAGE}
time yarn nx format:check --affected
time yarn nx affected:lint --base=${STAGE} ${generatedLibExcludes} 
time yarn nx affected:test --base=${STAGE} --exclude="integration-tests-angular" --exclude="integration-tests-universal" --exclude="anyupp-mobile" ${generatedLibExcludes} --codeCoverage --coverageReporters=clover
time yarn nx lint anyupp-mobile 
time yarn nx test-ci anyupp-mobile 
time yarn nx buildApk-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
