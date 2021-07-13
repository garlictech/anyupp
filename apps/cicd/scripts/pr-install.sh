#!/bin/bash
set -e

docker pull cirrusci/flutter &
chmod +x ./tools/*.sh
./tools/setup-aws-environment.sh
./tools/install-nodejs-14.sh
yarn --frozen-lockfile
npm install -g @aws-amplify/cli cowsay
npx cowsay "STARTING PR CHECK"',
