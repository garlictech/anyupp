#!/bin/bash
set -e
IFS='|'

creds=$(aws sts get-session-token)

echo "***** CREDS $creds"

AWS_ACCESS_KEY_ID=$(echo $creds | jq '.Credentials.AccessKeyId')
AWS_SECRET_ACCESS_KEY=$(echo $creds | jq '.Credentials.SecretAccessKey')
AWS_SESSION_TOKEN=$(echo $creds | jq '.Credentials.SessionToken')

echo "***** $AWS_PROFILE"

aws configure --profile $AWS_PROFILE set region $AWS_REGION
echo "*****1"
aws configure --profile $AWS_PROFILE set output "json"
echo "*****2"
aws configure --profile $AWS_PROFILE set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
echo "*****3"
aws configure --profile $AWS_PROFILE set aws_access_key_id "$AWS_ACCESS_KEY_ID"
echo "*****4"
aws configure --profile $AWS_PROFILE set aws_session_token "$AWS_SESSION_TOKEN"

echo "*****5"
