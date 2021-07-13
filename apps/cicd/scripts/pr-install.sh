#!/bin/bash
set -e

docker pull cirrusci/flutter 
chmod +x ./tools/*.sh
./tools/setup-aws-environment.sh
time ./tools/install-nodejs-14.sh
time yarn --frozen-lockfile
time npm install -g @aws-amplify/cli cowsay
npx cowsay "STARTING PR CHECK"',
