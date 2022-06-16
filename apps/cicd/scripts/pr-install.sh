#!/bin/bash
set -e

./apps/cicd/scripts/common-install.sh
npm install -g "@aws-amplify/cli@7.6.25" cowsay
npx cowsay "STARTING PR CHECK"
