#!/bin/bash
set -e
IFS='|'

aws configure --profile $AWS_PROFILE set region $AWS_REGION
aws configure --profile $AWS_PROFILE set output "json"
aws configure --profile $AWS_PROFILE set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure --profile $AWS_PROFILE set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure --profile $AWS_PROFILE set aws_session_token "$AWS_SESSION_TOKEN"
