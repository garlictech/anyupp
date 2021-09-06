#!/bin/bash
source './tools/utils.sh'

APPNAME=$1
STAGE=$2
UPSTREAM_APPNAME=anyupp-backend

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* When creating a private stack, we always start from the current"
echo "* official stack. So, we build that stack, then we transform"
echo "* that one into a private one."
echo "************************************************************************"
echo
tput sgr 0

./tools/build-workspace.sh $UPSTREAM_APPNAME $STAGE

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Then, we turn the official stack into a private stack, in some stages."
echo "*"
echo "* Configure the project files by the stack name (using hygen templates)"
echo "************************************************************************"
echo
tput sgr 0

HYGEN_OVERWRITE=1 yarn hygen project configure --app=$APPNAME

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Create new params in the parameter store with values copied from the"
echo "* official $STAGE stack"
echo "************************************************************************"
echo
tput sgr 0

function copyParameterFromUpstream() {
  PARAM_NAME_TO_COPY=$1

  PARAM_VALUE_TO_COPY=$(aws ssm get-parameter --name "/${STAGE}-${UPSTREAM_APPNAME}/${PARAM_NAME_TO_COPY}" | \
  jq -r '.Parameter.Value')

  X=$(aws ssm put-parameter \
  --name "/${STAGE}-${APPNAME}/${PARAM_NAME_TO_COPY}" \
  --type String \
  --value ${PARAM_VALUE_TO_COPY} \
  --overwrite )

  printf "${PARAM_NAME_TO_COPY}: ${PARAM_VALUE_TO_COPY} \n"
}

IFS=$'\n'
for param in $BASE_PARAMS; do
  copyParameterFromUpstream $param
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

yarn nx build anyupp-backend --app=$APPNAME --stage=$STAGE

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* It's time to create the CRUD api stack, that is an Amplify app."
echo "************************************************************************"
echo
tput sgr 0

pushd apps/crud-backend
../../tools/init-crud-api.sh $APPNAME $STAGE
popd

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Now deploy the minimal stack, to be able to create the amplify app"
echo "************************************************************************"
echo
tput sgr 0

pushd apps/anyupp-backend
yarn sst deploy $STAGE-$APPNAME-ParamsStack --stage=$STAGE
yarn sst deploy $STAGE-$APPNAME-SecretsManagerStack --stage=$STAGE
yarn sst deploy $STAGE-$APPNAME-cognito --stage=$STAGE
popd

tput bold
tput setaf 1
echo
echo "************************************************************************"
echo "* READ THIS! Let's configure the amplify stack! Adding auth and storage."
echo "*"
echo "* This part is interactive, you must select some options manually. Select"
echo "* the following options:"
echo "*"
echo "* 'What type of auth resource do you want to import?' > 'Cognito User Pool and Identity Pool' "
echo "* 'Select the User Pool you want to import' > $STAGE-$APPNAME-admin-user-pool (...)'"
echo "* 'Select a Native client to import' > the option contianing '(has app client secret)'"
echo "************************************************************************"
echo
tput sgr 0

pushd apps/crud-backend
amplify import auth


tput bold
tput setaf 1
echo
echo "************************************************************************"
echo "* Now, the storage. Select the following options:"
echo "*"
echo "* 'Please select from one of the below mentioned services' > 'Content (Images, audio, video, etc.)' "
echo "* 'Please provide a friendly name for your resource that will be used to label this category in the project': type anything or leave as is"
echo "* 'Please provide bucket name:': type anything or leave as is"
echo "* 'Who should have access:' > 'Auth and guest users'"
echo "* 'What kind of access do you want for Authenticated users?' select all the options"
echo "* 'What kind of access do you want for Guest users?' select read only"
echo "* 'Do you want to add a Lambda Trigger for your S3 Bucket?' > N"
echo "************************************************************************"
echo
tput sgr 0

amplify add storage

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Deploying the Amplify stack in the cloud..."
echo "************************************************************************"
echo
tput sgr 0
amplify push --yes

tput bold
tput setaf 1
echo
echo "************************************************************************"
echo "* Now, the API. Select the following options:"
echo "*"
echo "* 'Please select from one of the below mentioned services:' > 'GraphQL' "
echo "* 'Provide API name:': type anything or leave as is"
echo "* 'Choose the default authorization type for the API': 'API key'"
echo "* 'Enter a description for the API key' > type what you like"
echo "* 'After how many days from now the API key should expire' > 365"
echo "* 'Do you want to configure advanced settings for the GraphQL API': 'Yes, I want to make some additional changes.'"
echo "* 'Configure additional auth types?' > Y"
echo "* 'Choose the additional authorization types you want to configure for the API' > select 'Amazon Cognito User Pool' and 'IAM'"
echo "* 'Enable conflict detection?' > N"
echo "* 'Do you have an annotated GraphQL schema?' > Y"
echo "* 'Do you have an annotated GraphQL schema?' > Y"
echo "* 'Provide your schema file path:' > ../../libs/crud-gql/backend/src/graphql/schema/crud-api.graphql "
echo "************************************************************************"
echo
tput sgr 0

amplify add api
amplify push --yes
popd


tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* At this point, we have all the resources to proceed. So, we rebuild"
echo "* and deploy the whole ${APPNAME} stack."
echo "************************************************************************"
echo
tput sgr 0

yarn nx build anyupp-backend --app=$APPNAME --stage=$STAGE
yarn nx deploy anyupp-backend --app=$APPNAME --stage=$STAGE

tput bold
tput setaf 2
echo
echo "************************************************************************"
echo "* Now, as test, we rebuild and redeploy the whole project to make sure"
echo "* that everythink is in place."
echo "************************************************************************"
echo
tput sgr 0

./tools/build-workspace.sh $APPNAME $STAGE
yarn nx deploy crud-backend --app=$APPNAME --stage=$STAGE
yarn nx deploy anyupp-backend --app=$APPNAME --stage=$STAGE

