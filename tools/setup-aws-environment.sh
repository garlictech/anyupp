#!/bin/bash
set -e
IFS='|'

aws configure  set region $AWS_REGION
aws configure  set output "json"
aws configure  set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure  set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure  set aws_session_token "$AWS_SESSION_TOKEN"
export PATH='$PATH:/tmp/flutter/bin'

