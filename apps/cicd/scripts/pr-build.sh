#!/bin/bash
set -e

ENVNAME=$1

excludes="--exclude=anyupp-mobile"

./tools/build-workspace.sh ${ENVNAME} ${CI}
yarn nx synth anyupp-backend --env=${ENVNAME}
yarn nx synth common-backend --env=dev
yarn nx format:check --affected
export DEBUG=*
yarn nx affected:lint --base=dev ${excludes}
yarn nx affected:test --base=dev ${excludes} \
  --exclude="integration-tests-angular" \
  --exclude="integration-tests-universal" \
  ${excludes} --codeCoverage --coverageReporters=clover
yarn nx unit-test-ci anyupp-mobile
yarn nx lint-ci anyupp-mobile
yarn nx buildAppbundle-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
