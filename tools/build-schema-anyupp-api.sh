#!/bin/bash
set -e
IFS='|'

echo
echo 'Generate typescript api'
echo '=============================='
yarn graphql-codegen --config tools/graphql-codegen-anyupp.yml
echo 'Done.'

