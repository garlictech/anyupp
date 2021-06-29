#!/bin/bash

# Entrypoint of Dockerfile-staging2prod!

set -e
IFS='|'

SOURCE_AWS_PROFILE=anyupp
TARGET_AWS_PROFILE=anyupp-prod
BACKUP_DIR=/tmp/anyupp-backups
SOURCE_APP=anyupp-backend
SOURCE_STAGE=staging
TARGET_APP=anyupp-backend
TARGET_STAGE=prod

TABLES="
AdminUser
RoleContext
Chain
Group
ProductCategory
ProductComponent
ProductComponentSet
ChainProduct
GroupProduct
UnitProduct
Cart
Unit
"

function getApiID() {
  APP=$1
  STAGE=$2
  /pull-crud-api.sh $APP $STAGE 

  APPID=$(aws ssm get-parameter --name "/$STAGE-$APP/generated/CrudApiAppId" | \
    jq -r '.Parameter.Value')
  echo "APPID=$APPID"

  APINAME=$(aws amplify get-app --app-id $APPID | jq -r ".app.name")
  echo "APINAME=$APINAME"

  METAFILE=amplify/backend/amplify-meta.json
  API_ID=$(jq -r ".api.$APINAME.output.GraphQLAPIIdOutput" $METAFILE)
  echo "API_ID=$API_ID"
}

echo "Dumping data from ${SOURCE_APP}, stage ${SOURCE_STAGE}"
export AWS_PROFILE=$SOURCE_AWS_PROFILE
SOURCE_USERPOOLID=$(aws ssm get-parameter --name "/${SOURCE_STAGE}-${SOURCE_APP}/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value')

echo "Dumping user pool $SOURCE_USERPOOLID"
cbr backup --pool $SOURCE_USERPOOLID --profile $SOURCE_AWS_PROFILE --region $AWS_REGION --dir $BACKUP_DIR

getApiID $SOURCE_APP $SOURCE_STAGE
SOURCE_API_ID=$API_ID
echo "SOURCE API ID: $SOURCE_API_ID"

IFS=$'\n'
for table in $TABLES; do
  table=$table-$SOURCE_API_ID-$SOURCE_STAGE
  echo "Dumping table $table..."
  dynamodump -m backup -r eu-west-1 -s $table
done

# RESTORE DATA
echo "Restoring data to ${TARGET_APP}, stage ${TARGET_STAGE}"
export AWS_PROFILE=$TARGET_AWS_PROFILE
getApiID $TARGET_APP $TARGET_STAGE
TARGET_API_ID=$API_ID
echo "TARGET API ID: $TARGET_API_ID"

IFS=$'\n'
for table in $TABLES; do
  sourceTable="${table}-${SOURCE_API_ID}-${SOURCE_STAGE}"
  targetTable="${table}-${TARGET_API_ID}-${TARGET_STAGE}"
  echo "Restoring table $sourceTable to $targetTable..."
  dynamodump --dataOnly -m restore -r eu-west-1 -s $sourceTable -d $targetTable
done

TARGET_USERPOOLID=$(aws ssm get-parameter --name "/${TARGET_STAGE}-${TARGET_APP}/generated/AdminUserPoolId" | \
  jq -r '.Parameter.Value')
echo "Importing user pool $TARGET_USERPOOLID"
cbr restore -f $BACKUP_DIR/$SOURCE_USERPOOLID.json --profile $TARGET_AWS_PROFILE --pool $TARGET_USERPOOLID --region $AWS_REGION

