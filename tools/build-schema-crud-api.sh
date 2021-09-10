#!/bin/bash
set -e
IFS='|'

ENVNAME=$1
APPNAME=anyuppbackend

cp ../../libs/crud-gql/backend/src/graphql/schema/crud-api.graphql amplify/backend/api/$APPNAME/schema.graphql

amplify api gql-compile
amplify codegen
yarn graphql-codegen --config tools/graphql-codegen-crud.yml

