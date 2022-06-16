#!/bin/bash
set -e

ENVNAME=$1

excludes="--exclude=anyupp-mobile,apps-admin"

rm -rf /tmp/nx
./tools/build-workspace.sh ${ENVNAME} ${CI}
echo "*******************"
du -sh /tmp/nx
echo "*******************"
yarn nx synth anyupp-backend --env=${ENVNAME}
yarn nx synth common-backend --env=dev
yarn nx format:check --affected
echo "*******************"
du -sh /tmp/nx
echo "*******************"
export DEBUG=*
yarn nx affected:lint --base=dev ${excludes} --skip-nx-cache
echo "*******************"
du -sh /tmp/nx
echo "*******************"
yarn nx affected:test --base=dev ${excludes} \
  --exclude="integration-tests-angular" \
  --exclude="integration-tests-universal" \
  ${excludes} --codeCoverage --coverageReporters=clover
echo "*******************"
du -sh /tmp/nx
echo "*******************"
yarn nx unit-test-ci anyupp-mobile
yarn nx lint-ci anyupp-mobile
yarn nx buildAppbundle-ci anyupp-mobile
npx cowsay "YOUR PR IS SUPERCOOL!!!"
