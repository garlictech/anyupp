#!/bin/bash
set -e
IFS='|'

export AWS_PAGER=""

APPNAME=$1
STAGE=$2

amplify push --yes

aws ssm put-parameter \
  --type String \
  --overwrite \
  --value ${APPID} \
  --name "${STAGE}-${APPNAME}/generated/CrudApiAppId"

