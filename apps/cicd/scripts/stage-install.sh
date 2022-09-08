#!/bin/bash
set -e

./apps/cicd/scripts/common-install.sh
npm install -g "@aws-amplify/cli@10.0.0" cowsay appcenter-cli
npx cowsay "STARTING THE BUILD"
