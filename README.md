[![Appcenter Build status - IOS](https://build.appcenter.ms/v0.1/apps/b0bf2ec0-0acc-4871-a0e9-dcd93586fa05/branches/dev/badge)](https://appcenter.ms)

# Anyupp

See the official nx docs below, let's start with the Anyupp-specific stuff.

## General knowledge

The system supports building and deploying separate stacks for development and
testing purposes. You have to configure and build these stacks, according to the
sections below. The configuration and build commands generally support `app` and
`stage` flags. The `app` is an unique identification of your stack. The stage is
important as the app uses some stage-dependent externally configured resources
(like secrets). The stage specifies which resource set is used.
There are three stages: `dev`, `qa`, `producton`.

Production is not yet available!

You should almost always use the `dev` stage.

The app name for production is currently `anyupp-backend`. Don't overwrite it
please :)

## Pre-requisites

Install the following tools:

- AWS CLI - [install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
- Amplify CLI - `npm i -g @aws-amplify/cli`
- The following command line tools: `jq` - [install](https://stedolan.github.io/jq/)

## Configuring/building the project

Use the `config` build targets for projects requiring configuration.
Use the `build` build targets for projects requiring build/code generation.

**the graphql schemas**

`nx build anyupp-gql-api  --skip-nx-cache`

Whenever the anyupp-gql schema changes, you must execute the code generation phase for the
clients.

`nx build-schema crud-backend --app=anyupp-backend --stage=dev`

The command copies the crud-api schema from github to the configured crud-api project (managed by Amplify)
and generates client-side code to the `crud-gql/api` project. It does not deploy the backend!

**the configs (and secrets)**

`nx config shared-config --app=APPNAME --stage=dev` :exclamation: use your own app name

Always add the parameters, there are no defaults supported!

Execute this command when:

- you clone the github repo
- any config parameters change in the AWS Parameter Store or AWS Secret Manager
- you change the project stage (dev, production, qa)

The command fetches the config parameters and writes them into files in
`libs/shared/config`. You need AWS credentials set in your environment with the
appropriate access!

**IMPORTANT**

The configs are generated in `/libs/shared/config/src/lib/<stage>`. This folder
is gitignored. Ensure that the configs are NOT checked in to github otherwise
you WILL experience differences in your local and the remote environments.

Check the invoked scripts for their internals and parameters!

## Create private stack

First, find a name for your app stack. It is important, as it will appear everywhere: amplify app names, CDK stack, etc.
In the examples below, we use APPNAME for the stack name. Then, choose an environment: dev, qa, prod. The difference
between the stage environments are the different parameters in the parameter store.

**WARNING** Don't use dots in the private stack name.

### Option 1: Create everything from scratch

After cloning the repo, configure your environment. You need the following environment variables:

```
export AWS_PROFILE=anyupp
export EDITORNAME=vim
```

... if, for a reason, you don't like vim, use something else, VScode is `code`. Any editor command works.

Then, create an amplify app for admin:

`nx init crud-backend --app APPNAME --stage STAGE` :exclamation: use your own app name

The stuff writes the amplify app id to parameter store, CDK will use it to fetch
the amplify resources.

**WARNING** The command above overwrites the amplify app id belonging to the CDK
stack in the Parameter Store!

Unfortunately, the SST tools we use to deploy the CDK stack do not support app name parametrization, so:

- in `apps/anyupp-backend/sst.json`, write your app name
  to the "name" field
- in `anyupp-backend/serverless.yml`, use the same name
  in the `service` field
- in `apps/crud-backend/.graphqlconfig.yml`, use the same name
  in the `schemaPath` field (...api/<APPNAME>/build...)
- build and deploy the stack to the desired stage (it will use the stage-related
  parameters, secrets, etc:)

:exclamation: use your own app name

!!! Before the next command probably you should regenerate the appsync/grahpql schema or the next command: `nx build infra...` wont work

```
nx build anyupp-backend --app=APPNAME --stage=dev
nx deploy anyupp-backend --app=APPNAME --stage=dev
```

**Be careful** and do NOT check in the mentioned two config files!

Ok, now we have an amplify app and a CDK stack, and they know about each other.
Finish configuring amplify, by adding the previously created Cognito resources and
the API. Unfortunately, the procedure is not fully automated, as the add/import commands
are not yet supported in headless mode :( So fill in the forms if required.

Cognito part:

```
cd apps/crud-backend
amplify remove auth
amplify import auth
```

- Choose `Cognito User Pool and Identity Pool`
- Select your new user pool (STAGE-APPNAME-admin-user-pool)
- Select the native client (in this point it should assume well which client is the native one)

Appsync part:

```
amplify add api
```

Answer these questions

- ? Please select from one of the below mentioned services: `GraphQL`
- ? Provide API name: `APPNAME` :exclamation: use your own app name
- ? Choose the default authorization type for the API: `API key`
- ? Enter a description for the API key: `DEV graphql api key`
- ? After how many days from now the API key should expire (1-365): `365`
- ? Do you want to configure advanced settings for the GraphQL API: `Yes, I want to make some additional changes.`
- ? Configure additional auth types? `Yes`
- ? Choose the additional authorization types you want to configure for the API
  - `Amazon Cognito User Pool`
  - `IAM`

Cognito UserPool configuration
Use a Cognito user pool configured as a part of this project.

- ? Enable conflict detection? `No`
- ? Do you have an annotated GraphQL schema? `Yes`
- ? Provide your schema file path: `../../libs/crud-gql/backend/src/graphql/crud-api.graphql`


```
amplify add storage
```

- ? Please select from one of the below mentioned services: `Content (Images, audio, video, etc.)`
- ? Please provide a friendly name for your resource that will be used to label this category in the project: `anyuppstorage`
- ? Please provide bucket name: `anyupp-images`
- ? Who should have access: `Auth and guest users`
- ? What kind of access do you want for Authenticated users? (Press <space> to select, <a> to toggle all, <i> to invert selection) `read`
- ? What kind of access do you want for Guest users? `read`
- ? Do you want to add a Lambda Trigger for your S3 Bucket? `(y/N)`



Then, we should push the app, and generat code. Code generation steps:

```
amplify push
```

- ? Do you want to generate code for your newly created GraphQL API `Yes`
- ? Choose the code generation language target `typescript`
- ? Enter the file name pattern of graphql queries, mutations and subscriptions `../../libs/crud-gql/api/src/lib/generated/graphql/**/*.graphql`
- ? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions `Yes`
- ? Enter maximum statement depth [increase from default if your schema is deeply nested] `10`
- ? Enter the file name for the generated code `../../libs/crud-gql/api/src/lib/generated/api.ts`
- ? Do you want to generate code for your newly created GraphQL API `Yes`

Then, answer `yes` to the _code generation/code overwrite_ questions.

So, for auth, add API key, IAM and user pool options. Select the annotated schema file
from your source tree.

**WARNING** always synchronize the schema files between amplify and github! When you
change the schema, apply the changes to `libs/crud-gql/backend/src/graphql/crud-api.graphql`
as well!

### Option 2: Configure your project with existing resources

You should use this option when you clone the repo or change app stack and/or stage.
Mind, that this method assumes that you followed the naming convention in the previous section,
you need to configure full arbitrary resources, then you are on your own: check resource id-s
in the AWS console, use the shell scripts behind the angular commands as hints.

First, pull the admin amplify app:

`nx config crud-backend --app APPNAME --stage STAGE` :exclamation: use your own app name

example: `nx config crud-backend --app anyupp-backend --stage dev` for the dev

It pulls the admin Amplify project and connects it to the actual CDK resources.

## CRUD api resources

The above `nx config crud-backend` generates a config file `libs/crud-gql/backend/src/generated/table-config.json`
containing the table names/arns of the crud backend.

## Building the project

Like the config stage, we have to tell the system which stack (app) and stage you
are working with. So the build/deploy commands support the `app` and `stage`
parameters.

Or, they should support it if needed, we have to add this support gradually. For
some samples, see the build targets belonging to the examples in the
`angular.json`.

### Build the crud (amplify) app

`nx build-schema crud-backend --app=APPNAME --stage=dev`

The command builds the _current_ configured app / stage.

**IMPORTANT**: the build overwrites the schema with the current github schema!

Deploy the current app/stage:

`nx deploy crud-backend --app=APPNAME --stage=dev`

To build the admin site for a given configuration:

Building the stack:

`nx build anyupp-backend --app=APPNAME --stage=dev` :exclamation: use your own app name

Deploying the stack:

`nx deploy anyupp-backend --app=APPNAME --stage=dev` :exclamation: use your own app name

## Deleting the stack

Destroy the admin amplify app:

`nx remove crud-backend --app=APPNAME --stage=dev`

**WARNING**: the command destroys the amplify app that is currently pulled! Both the local
and the backend resources so be careful.

Then, remove the CDK stack:

`nx remove anyupp-backend --stage=dev`

**WARNING** it removes the given stage of the app currently set in `sst.json`.

## Manual testing the project

The deployed admin sites:

- DEV: https://dev-admin-anyupp-backend.anyupp.com/
- QA: https://qa-admin.-nyupp-backend.anyupp.com/

### Seeding

Both systems have some minimal data seeded at deploy/creation time.

**IMPORTANT**: the seed process is executed only when the seed stack or its
dependencies deployed/modified!

To execute the seeder locally run the following command:
`yarn ts-node --project ./tools/tsconfig.tools.json -r tsconfig-paths/register ./tools/seed-execute.ts`

### Test user

- A test user: username: `test@anyupp.com`, password: `Testtesttest12_`, context: `SU_CTX_ID`

If you want to test registration, email, etc., then you should use a disposable email service, for example
https://temp-mail.org/hu/

## Some useful tools

### Create a new admin user

`sh ./tools/create-admin-user.sh CDK-BACKEND-APPNAME STAGE USERNAME PASSWORD`

Example:

`sh ./tools/create-admin-user.sh anyupp-backend dev foouser Barbarbar12_`

It creates and verifies the cognito user only, it does not create anything in the
database!

## Integration tests

We collect all teh integration tests to `libs/integration-test` and develop/execute
them with jest. We must separete them from the other components, because we don't want
to interfere with the unit tests.

Execute all the integration tests:

`nx test integration-tests`

Execute on single integration test suite:

`yarn jest -c libs/integration-tests/universal/jest.config.js libs/integration-tests/src/lib/backend-seed.spec.ts`
`yarn jest -c libs/integration-tests/angular/jest.config.js admin`

## Executing cucumber/cypress tests

After cloning the repo:

```
yarn install
yarn nx e2e admin-e2e
```

The last command should build and start the admin, launch cypress and execute the admin tests. To start it in watch mode:

```
yarn nx e2e admin-e2e --watch
```

To launch cypress and execute the admin test on the REMOTE admin without the starting the admin locally.

```
yarn nx e2e-remote admin-e2e --watch --baseUrl=https://qa.admin.anyupp-backend.anyupp.com/
```

All the reports and videos recording the test execution are generated in the `cyreport` folder of the project root. To generate a nice html report out of them:

```

yarn cucumber:report
```

then open `cyreport/cucumber_report.html` file with the browser. Enjoy!

To get a super-cool report, with failure screenshots embedded:

`yarn cypress:generate:html:report`

then open `cyreport/cypress-tests-report.html` file with the browser.

### Writing Cucumber/Cypress tests

#### VsCode

To have Gherkin Syntax highlighting, step suggestions, linting and "Go to definition" support install and configure the
[Cucumber Full Language Support](https://github.com/alexkrechik/VSCucumberAutoComplete#how-to-use) extension

1. Install the `cucumberautocomplete` extension

1. Set the following configs in your `.vscode/settings.json` file

```
    "cucumberautocomplete.steps": [
      "apps/admin-e2e/src/integration/**/*.steps.ts",
    ],
    "cucumberautocomplete.strictGherkinCompletion": true,
    "cucumberautocomplete.smartSnippets": true,
    "cucumberautocomplete.stepsInvariants": true
```

## The generated nx docs

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@bgap/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

Use `--exclude="PROJECT_NAME"` to exclude the int tests
`nx affected:test --exclude="anyupp-mobile" --exclude="integration-tests-angular" --exclude="integration-tests-universal"`

### Using jest options [Nrwl - testing](https://nx.dev/latest/angular/cli/test#testfile)

Run `nx test projectName --i --testFile=partOfASpecFileNameToTest --watch` to execute the unit tests on a single file in runInBand and watch mode.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

## Generators

[Generators](https://nx.dev/latest/angular/plugins/workspace/nrwl-workspace-overview)

TIP: use `--dry-run` to check your idea. It shows what will be generated without writing to disk.

### Generate an Angular page with ngrx store

`nx g @nrwl/angular:lib admin/pages/<pageName>` (page module)
`ng g @nrwl/angular:lib admin/shared/data-access/<pageName>` (featureStore module)
`nx g @nrwl/angular:ngrx <pageName> --module=libs/admin/shared/data-access/<pageName>/src/lib/admin-shared-data-access-<pageName>.module.ts --defaults`

### Generate a ??? (simple workspace lib)

`nx g @nrwl/workspace:lib shared/config`

### [Remove an app or lib](https://nx.dev/latest/angular/plugins/workspace/generators/remove)

`nx g @nrwl/workspace:rm shared-config-firebase`

### [Move an app or lib](https://nx.dev/latest/angular/workspace/move)

`nx g @nrwl/workspace:move --project projectName new/path`

### Generate a nest lib

```
nx g @nrwl/nest:lib ...
nx g @nrwl/nest:lib api/graphql/schema
nx g @nrwl/nest:lib api/graphql/resolvers
```

### Generate a nest graphQL resolver

The generator will collect the new resolver's name
`nx g @nrwl/nest:resolver -p api-graphql-resolvers`

### Start admin

`nx serve admin`

### Start graphql server

`nx serve graphql-server`

### Run lint

`nx run-many --target=lint --all --fix`

### Run test

`nx run-many --target=test --all --passWithNoTests`

### Update own backend stack

1. Set stage name in apps/anyupp-backend/sst.json (e.g. dev-petrot)

2. Download own config:
   `yarn ts-node ./tools/fetch-configuration.ts anyupp-backend dev-petrot`

3. Build & deploy
   nx build anyupp-backend --app=APPNAME --stage=dev
   nx deploy anyupp-backend --app=APPNAME --stage=dev

### Amplify - Admin

Generate amplify GQL models - this script moves the models folder into the lib folder
`yarn codegen:models`

### Amplify - Mobile

Configure mobile app.
You need to upload some keys to the secretmanager and some paramaters to the parameter store.

### Mobile app parameters

Parameters that are required in the parameter store for the mobile app are the followings:
`'{STAGE}-{APPNAME}-region',` - Server region, eg eu-west-1
`'{STAGE}-{APPNAME}-IdentityPoolId',` - Federated identity pool ID connected with the userpool
`'{STAGE}-{APPNAME}-consumerUserPoolId',` - User pool ID for the mobile app
`'{STAGE}-{APPNAME}-ConsumerUserPoolDomain',` - The domain of the User pool of the mobile app
`'{STAGE}-{APPNAME}-ConsumerNativeUserPoolClientId',` - The client id of the userpool used for the mobile app
`'{STAGE}-{APPNAME}-AnyuppGraphqlApiUrl',` - Amplify GraphQL API http endpoint (start with https://)
`'{STAGE}-{APPNAME}-AnyuppGraphqlApiKey',` - Amplify GraphQL API key
`'{STAGE}-{APPNAME}-GraphqlAdminApiUrl',` - Admin GraphQL API http endpoint (start with https://)
`'{STAGE}-{APPNAME}-GraphqlAdminApiKey',` - Admin GraphQL API key
`'{STAGE}-{APPNAME}-StripePublishableKey',` - The publishable key for the Stripe API
`'{STAGE}-{APPNAME}-SlackErrorWebhookUrl',` - Catcher Slack error reporter web hook url
`'{STAGE}-{APPNAME}-SlackErrorChannel',` - Catcher Slack error reporter channel name

### Mobile app secrets

You MUST upload the keystore files to sign in the Application with release keys! Open the secret manager with the environment (eg. `anyupp-dev-secrets`) and add the following values to the JSON map:
`androidKeyStore` - Base64 encoded value of the Android publish key, the file extension is JKS and must be convert to base64 string (and paste this base64 string here)
`androidKeyProperties` - Base64 encoded value of the properties of the keystore, need by the Android sign in mechanism

#### Convert files to base64 string

You must convert the JKS and property files to base64, and put these values into the secretmanager.

To convert a file to it's base64 representation use the following command on linux/unix:
`openssl base64 -in anyupp-dev.jks -out anyupp-dev.base64` - it converts the anyupp-dev.jks binary file to base64 string: you should paste the base64 value to the secretmanager

#### Format of the `androidKeyProperties` file

The property file which are contains the JKS key secret parameters (password, key alias, etc) is looks like this:
`key.properties`

```
storePassword=4GtWdaksd
keyAlias=AnyUpp
keyPassword=dsjhg324SG
```

You must convert it to base64 format and paste it to the secretmanager `anyupp-dev-secrets` environment's `androidKeyProperties` value.
`openssl base64 -in key.properties -out key.base64`

You must configure the mobile app environment, before you build the app (Android, ios).
To do this, run the following command:
`nx config shared-config --app=anyupp-backend --stage=dev`

Build APK for all the the system, splitted APKs by platform: "x86", "armeabi-v7a", "arm64-v8a"
`nx buildApk anyupp-mobile`

Build IOS app
`nx buildIos anyupp-mobile`

**Deploy to App Center**

`nx publish-appcenter anyupp-mobile --stage=dev --platform=android`

- stage is `dev`, `qa`, `prod`
- platform is `android`, `ios`

The tool assumes that you have a valid appcenter token in the `APP_CENTER_TOKEN`
environment variable. The tool uses the current app image path, so
be careful: if you want to publish QA, then build the app with QA config, then
publish!

## Tools

### Reconfig the whole workspace

`./tools/build-workspace.sh anyupp-backend dev`

Before it, remove `apps/crud-api/amplify`. Ensure that all your changes are pushed or discard them.
The command fethes the crud backend, the configurations and regenerates the code files.
