set -e
IFS='|'

export AWS_PAGER=""

function deleteParam() {
  aws ssm delete-parameter --name "/${STAGE}-${APPNAME}/$1"
}

function deleteGeneratedParam() {
  aws ssm delete-parameter --name "/${STAGE}-${APPNAME}/generated/$1"
}

BASE_PARAMS="
AppleKeyId
AppleServiceId
AppleTeamId
FacebookAppId
GoogleApiKey
GoogleClientId
MailtrapApiKey
StripePublishableKey
"

CRUD_PARAMS="
CrudApiAppId
"

