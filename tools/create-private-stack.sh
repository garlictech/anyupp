#!/bin/bash
source './tools/utils.sh'

ENVNAME=$1
APPNAME=anyupp-backend

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* When creating a private stack, we always start from the current"
echo "* official dev stack. So, we build that stack, then we transform"
echo "* that one into a private one."
echo "************************************************************************"
echo
tput sgr 0

./tools/build-workspace.sh dev 

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Then, we turn the official stack into a private stack, in some stages."
echo "************************************************************************"
echo
echo "************************************************************************"
echo "* Create new params in the parameter store with values copied from the"
echo "* official $ENVNAME stack"
echo "************************************************************************"
echo
tput sgr 0

function copyParameterFromUpstream() {
  PARAM_NAME_TO_COPY=$1

  PARAM_VALUE_TO_COPY=$(aws ssm get-parameter --name "/dev-${APPNAME}/${PARAM_NAME_TO_COPY}" | \
  jq -r '.Parameter.Value')

  X=$(aws ssm put-parameter \
  --name "/${ENVNAME}-${APPNAME}/${PARAM_NAME_TO_COPY}" \
  --type String \
  --value ${PARAM_VALUE_TO_COPY} \
  --overwrite )

  printf "${PARAM_NAME_TO_COPY}: ${PARAM_VALUE_TO_COPY} \n"
}

IFS=$'\n'
for param in $BASE_PARAMS; do
  copyParameterFromUpstream $param
echo
done
IFS='|'

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Build the anyupp backend app, now with the desired app name"
echo "************************************************************************"
echo
tput sgr 0

yarn nx build anyupp-backend --env=$ENVNAME

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Now deploy the minimal stack, to be able to create the amplify app"
echo "************************************************************************"
echo
tput sgr 0

pushd apps/anyupp-backend
yarn sst deploy $ENVNAME-$APPNAME-ParamsStack --stage=$ENVNAME
yarn sst deploy $ENVNAME-$APPNAME-SecretsManagerStack --stage=$ENVNAME
yarn sst deploy $ENVNAME-$APPNAME-cognito --stage=$ENVNAME
popd

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* It's time to create the CRUD api stack, that is an Amplify app."
echo "* We fork it from dev, then configure it with the parameters of your"
echo "* private stack."
echo "************************************************************************"
echo
tput sgr 0

pushd apps/crud-backend
../../tools/create-new-crud-api-env.sh $ENVNAME
popd

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* At this point, we have all the resources to proceed. So, we rebuild"
echo "* and deploy ${ENVNAME} stack."
echo "************************************************************************"
echo
tput sgr 0

yarn nx build crud-backend --env=$ENVNAME
yarn nx build anyupp-backend --env=$ENVNAME
yarn nx deploy anyupp-backend --env=$ENVNAME

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Now, as test, we rebuild and redeploy the whole project to make sure"
echo "* that everythink is in place."
echo "************************************************************************"
echo
tput sgr 0

./tools/build-workspace.sh $ENVNAME 
yarn nx deploy crud-backend --env=$ENVNAME
yarn nx deploy anyupp-backend --env=$ENVNAME

