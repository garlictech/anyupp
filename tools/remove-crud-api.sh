#!/bin/bash
source './tools/utils.sh'

APPNAME=$1
STAGE=$2

amplify delete --force

IFS=$'\n'
for param in $CRUD_PARAMS; do
  deleteGeneratedParam $param
done
