#!/bin/bash
source './tools/utils.sh'

ENVNAME=$1
APPNAME=$ENVNAME-anyupp-backend

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* We remove the Anyupp app."
echo "*"
echo "* If the remove operation fails, because some resources cannot be"
echo "* removed, then remove the blocking resources manually in the AWS"
echo "* console. Then re-run this command."
echo "************************************************************************"
echo
tput sgr 0

yarn nx remove anyupp-backend --env $ENVNAME

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Then, we remove the ${ENVNAME} environment of the CRUD (Amplify) app."
echo "************************************************************************"
echo
tput sgr 0

pushd apps/crud-backend
amplify env checkout dev
amplify env remove $ENVNAME
popd

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
echo "* Look for your app name ($ENVNAME) - normally, it is present in the"
echo "* resource names."
echo "************************************************************************"
echo
tput sgr 0

