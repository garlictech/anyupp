#!/bin/bash
set -e
IFS='|'

aws configure set region $AWS_REGION
echo "***** $AWS_PROFILE"

echo "***** $AWS_SECRET_ACCESS_KEY"
echo "*****1"
aws configure set output "json"
echo "*****2"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
echo "*****3"
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
echo "*****4"
aws configure set aws_session_token "$AWS_SESSION_TOKEN"

echo "*****5"
