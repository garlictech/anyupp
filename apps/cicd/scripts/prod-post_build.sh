#!/bin/bash
set -e

ENVNAME=$1
BUCKET_NAME=$2

./apps/cicd/scripts/common-post_build.sh $ENVNAME $BUCKET_NAME
