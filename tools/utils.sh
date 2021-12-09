set -e
IFS='|'

export AWS_PAGER=""

function deleteParam() {
  aws ssm delete-parameter --name "/${APPNAME}/$1"
}

function deleteGeneratedParam() {
  aws ssm delete-parameter --name "/${APPNAME}/generated/$1"
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
slackChannel
"

CRUD_PARAMS="
CrudApiAppId
"

