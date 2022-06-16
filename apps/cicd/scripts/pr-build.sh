#!/bin/bash
set -e

ENVNAME=$1

excludes="--exclude=anyupp-mobile"

rm -rf /tmp/nx
./tools/build-workspace.sh ${ENVNAME} ${CI}
yarn nx format:check --affected
yarn nx affected:lint --base=dev ${excludes} --skip-nx-cache
yarn nx affected:test --base=dev ${excludes} \
  --exclude="integration-tests-angular" \
  --exclude="integration-tests-universal" \
  ${excludes} --codeCoverage --coverageReporters=clover
yarn nx unit-test-ci anyupp-mobile
yarn nx lint-ci anyupp-mobile
yarn nx buildAppbundle-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
