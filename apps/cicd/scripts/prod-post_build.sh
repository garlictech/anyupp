#!/bin/bash
set -e

STAGE=$1
BUCKET_NAME=$2

./apps/cicd/scripts/common-post_build.sh $STAGE $BUCKET_NAME
