#!/bin/bash
set -e

ENVNAME=$1

excludes="--exclude=anyupp-mobile"

./tools/build-workspace.sh ${ENVNAME} ${CI}
yarn nx format:check --affected
yarn nx affected:lint --base=${ENVNAME} ${excludes}
yarn nx affected:test --base=${ENVNAME} ${excludes} --exclude="integration-tests-angular" --exclude="integration-tests-universal" ${excludes} --codeCoverage --coverageReporters=clover
yarn nx unit-test-ci anyupp-mobile
yarn nx lint-ci anyupp-mobile
yarn nx buildApk-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
