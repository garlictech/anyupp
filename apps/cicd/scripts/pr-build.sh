#!/bin/bash
set -e

APPNAME=$1
STAGE=$2

excludes="--exclude=anyupp-mobile"

./tools/build-workspace.sh ${APPNAME} ${STAGE} ${CI}
yarn nx format:check --affected
yarn nx affected:lint --base=${STAGE} ${excludes}
yarn nx affected:test --base=${STAGE} ${excludes} --exclude="integration-tests-angular" --exclude="integration-tests-universal" ${excludes} --codeCoverage --coverageReporters=clover
yarn nx test-ci anyupp-mobile
yarn nx lint-ci anyupp-mobile
yarn nx buildApk-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
