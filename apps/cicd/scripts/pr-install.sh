#!/bin/bash
set -e

./apps/cicd/scripts/common-install.sh
npm install -g @aws-amplify/cli cowsay 
npx cowsay "STARTING PR CHECK"
