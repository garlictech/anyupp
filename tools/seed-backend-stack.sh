#!/bin/bash
set -e
IFS='|'

export AWS_PAGER=""

APPNAME=$1
STAGE=$2

USERNAME=${3:-test@test.com}
PASSWORD=${4:-"Hideghegy12_"}

sh ./tools/create-admin-user.sh $APPNAME $STAGE $USERNAME $PASSWORD

