#!/bin/bash
set -e
IFS='|'

export AWS_PAGER=""

APPNAME=$1
STAGE=$2
USERNAME=$3
PASSWORD=$4

REGION=$(aws configure get region)

USERPOOLID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/adminUserPoolId" | \
  jq -r '.Parameter.Value')

WEBCLIENTID=$(aws ssm get-parameter --name "${STAGE}-${APPNAME}/generated/adminWebUserPoolClientId" | \
  jq -r '.Parameter.Value')

if aws cognito-idp admin-get-user \
  --user-pool-id $USERPOOLID \
  --username $USERNAME 2&>/dev/null    ; then
  echo "User $USERNAME already exists."
else
  aws cognito-idp admin-create-user \
    --user-pool-id $USERPOOLID \
    --username $USERNAME

  aws cognito-idp admin-set-user-password \
    --user-pool-id $USERPOOLID \
    --username $USERNAME \
    --password $PASSWORD \
    --permanent
fi

