#!/bin/bash
source './tools/utils.sh'

APPNAME=$1
STAGE=$2

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* We remove the Anyupp app."
echo "************************************************************************"
echo
tput sgr 0

yarn nx remove anyupp-backend --stage $STAGE

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Then, we remove the CRUD (Amplify) app."
echo "************************************************************************"
echo
tput sgr 0

yarn nx remove crud-backend --app $APPNAME --stage $STAGE

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Finally, we remove the paramaters from the parameter store"
echo "************************************************************************"
echo
tput sgr 0

IFS=$'\n'
for param in $BASE_PARAMS; do
  deleteParam $param
done

tput bold
tput setaf 1
echo
echo "************************************************************************"
echo "* Ok, stack removed, now check the console and remove potentially remained"
echo "* resources: cognito user pools, s3 buckets, cloudformation stacks."
echo "*"
echo "* Look for your app name ($APPNAME) - normally, it is present in the"
echo "* resource names."
echo "************************************************************************"
echo
tput sgr 0

