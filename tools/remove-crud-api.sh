#!/bin/bash
source '../../tools/utils.sh'

amplify delete --force

IFS=$'\n'
for param in $CRUD_PARAMS; do
  deleteGeneratedParam $param
done
