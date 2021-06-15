---
to: apps/anyupp-backend/serverless.yml
---
org: anyupp
service: <%= app %>
configValidationMode: error
frameworkVersion: ^2.16.1

plugins:
  - serverless-bundle

package:
  individually: true

custom:
  # Our stage is based on what is passed in when running serverless
  # commands. Or falls back to what we have set in the provider section.
  stage: ${opt:stage, self:provider.stage}
  # Name of the SST app that's deploying our infrastructure
  sstApp: ${self:custom.stage}-<%= app %>
  bundle:
    packager: yarn
    linting: false
    sourcemaps: true
    caching: true

  offline:
    useChildProcesses: true

provider:
  name: aws
  runtime: nodejs14.x
  lambdaHashingVersion: 20201221

functions:
  auto-delete-bucket:
    handler: lib/lambda/auto-delete-bucket/index.handler

  appsync-lambda:
    handler: lib/lambda/appsync-lambda/index.handler

  stripe-webhook:
    handler: lib/lambda/stripe-webhook/index.handler

  stack-seeder:
    handler: lib/lambda/stack-seeder/index.handler

  pre-token-generation:
    handler: lib/lambda/pre-token-generation/index.handler

  cognito-trigger-setup:
    handler: lib/lambda/cognito-trigger-setup/index.handler

  consumer-pre-signup:
    handler: lib/lambda/consumer-pre-signup/index.handler
