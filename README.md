[![iOS DEV app](https://build.appcenter.ms/v0.1/apps/b0bf2ec0-0acc-4871-a0e9-dcd93586fa05/branches/dev/badge)](https://appcenter.ms)
[![iOS QA app](https://build.appcenter.ms/v0.1/apps/308fdf1a-bd46-40f9-b3a5-6ccfb7b0edd2/branches/qa/badge)](https://appcenter.ms)
[![iOS STAGING app](https://build.appcenter.ms/v0.1/apps/a370b1c5-81c7-44c1-8d84-3e931c3abd46/branches/staging/badge)](https://appcenter.ms)
[![iOS PROD app](https://build.appcenter.ms/v0.1/apps/f8c856fd-c72e-46b2-831f-393354e16a3f/branches/master/badge)](https://appcenter.ms)
[![CodeFactor](https://www.codefactor.io/repository/github/bgap/anyupp/badge/dev?s=e93c51ecee20883666aec3eb28394da7650bd544)](https://www.codefactor.io/repository/github/bgap/anyupp/overview/dev)
[![DeepSource](https://deepsource.io/gh/bgap/anyupp.svg/?label=active+issues&show_trend=true&token=rpFqahUIHd2R6-9vKBMMupbE)](https://deepsource.io/gh/bgap/anyupp/?ref=repository-badge)

# Anyupp

See the official nx docs below, let's start with the Anyupp-specific stuff.

## General knowledge

See the [wiki](https://github.com/bgap/anyupp/wiki).

## Configuring/building the project

Use the `config` build targets for projects requiring configuration.
Use the `build` build targets for projects requiring build/code generation.

**the whole project**

The `tools/build-workspace.sh` script supports this part, so it generates the project
for you

**the graphql schemas**

`nx build-schema anyupp-gql-api --skip-nx-cache`

Whenever the anyupp-gql schema changes, you must execute the code generation phase for the
clients.

`nx build-schema crud-backend --env=dev`

The command copies the crud-api schema from github to the configured crud-api project (managed by Amplify)
and generates client-side code to the `crud-gql/api` project. It does not deploy the backend!

**the configs (and secrets)**

`nx config shared-config --env=ENVNAME` :exclamation: use your own app name

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

See [the wiki page](wiki/Private-backend-stack)

## Building the project

Like the config stage, we have to tell the system which stack (app) and stage you
are working with. So the build/deploy commands support the `app` and `stage`
parameters.

Or, they should support it if needed, we have to add this support gradually. For
some samples, see the build targets belonging to the examples in the
`angular.json`.

### Build the crud (amplify) app

`nx build-schema crud-backend --env=ENVNAME`

The command builds the _current_ configured app / stage environment.

**IMPORTANT**: the build overwrites the schema with the current github schema!

Deploy the current app/stage:

`nx deploy crud-backend --env=ENVNAME`

To build the admin site for a given configuration:

Building the stack:

`nx build anyupp-backend --env=ENVNAME` :exclamation: use your own app name

Deploying the stack:

`nx deploy anyupp-backend --env=ENVNAME` :exclamation: use your own app name

## Deleting the stack

Destroy the admin amplify app environment:

`nx remove crud-backend --env=ENVNAME`

**WARNING**: the command destroys the amplify app that is currently pulled! Both the local
and the backend resources so be careful.

Then, remove the CDK stack:

`nx remove anyupp-backend`

**WARNING** it removes the given stage of the app currently set in `sst.json`.

## Manual testing the project

The deployed admin sites:

- DEV: https://dev-admin-anyupp-backend.anyupp.com/
- QA: https://qa-admin-anyupp-backend.anyupp.com/

### Seeding

Both systems have some minimal data seeded at deploy/creation time.

**IMPORTANT**: the seed process is executed only when the seed stack or its
dependencies deployed/modified!

To execute the seeder locally run the following command:
`yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register ./tools/seed-execute.ts`

### Test user

- A test user: username: `testuser+<id>`, email: `<username>@anyupp.com`, password: `Hideghegy12_`, context: `SU_CTX_ID`
- The seeded test users (same password, context):

```
  testuser+test@anyupp.com,
  testuser+bob@anyupp.com,
  testuser+alice@anyupp.com,
  testuser+monad@anyupp.com,
  testuser+kati@anyupp.com,
  testuser+emen@anyupp.com,
  testuser+e2e@anyupp.com,
```

If you want to test registration, email, etc., then you should use a disposable email service, for example
https://temp-mail.org/hu/

## Some useful tools

### Create a new admin user

`sh ./tools/create-admin-user.sh CDK-BACKEND-ENVNAME STAGE USERNAME PASSWORD`

Example:

`sh ./tools/create-admin-user.sh anyupp-backend dev foouser Barbarbar12_`

It creates and verifies the cognito user only, it does not create anything in the
database!

## Integration tests

We collect all the integration tests to `libs/integration-test` and develop/execute
them with jest. We must separete them from the other components, because we don't want
to interfere with the unit tests.

Execute all the integration tests:

`nx test integration-tests`

Execute on single integration test suite:

`yarn jest -c libs/integration-tests/universal/jest.config.js libs/integration-tests/src/lib/backend-seed.spec.ts`

Execute the `admin` integration tests:

`yarn jest -c libs/integration-tests/angular/jest.config.js admin`

## Executing cucumber/cypress tests

See [e2e-testing-with-Cucumber].

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
   nx build anyupp-backend --env=ENVNAME
   nx deploy anyupp-backend --env=ENVNAME

### Amplify - Admin

Generate amplify GQL models - this script moves the models folder into the lib folder
`yarn codegen:models`

### Amplify - Mobile

Configure mobile app.
You need to upload some keys to the secretmanager and some paramaters to the parameter store.

### Mobile app parameters

Parameters that are required in the parameter store for the mobile app are the followings:
`'{STAGE}-{ENVNAME}-Region',` - Server region, eg eu-west-1
`'{STAGE}-{ENVNAME}-IdentityPoolId',` - Federated identity pool ID connected with the userpool
`'{STAGE}-{ENVNAME}-consumerUserPoolId',` - User pool ID for the mobile app
`'{STAGE}-{ENVNAME}-ConsumerUserPoolDomain',` - The domain of the User pool of the mobile app
`'{STAGE}-{ENVNAME}-ConsumerNativeUserPoolClientId',` - The client id of the userpool used for the mobile app
`'{STAGE}-{ENVNAME}-AnyuppGraphqlApiUrl',` - Amplify GraphQL API http endpoint (start with https://)
`'{STAGE}-{ENVNAME}-AnyuppGraphqlApiKey',` - Amplify GraphQL API key
`'{STAGE}-{ENVNAME}-GraphqlAdminApiUrl',` - Admin GraphQL API http endpoint (start with https://)
`'{STAGE}-{ENVNAME}-GraphqlAdminApiKey',` - Admin GraphQL API key
`'{STAGE}-{ENVNAME}-StripePublishableKey',` - The publishable key for the Stripe API
`'{STAGE}-{ENVNAME}-SlackErrorWebhookUrl',` - Catcher Slack error reporter web hook url
`'{STAGE}-{ENVNAME}-SlackErrorChannel',` - Catcher Slack error reporter channel name

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
`nx config shared-config --env=anyupp-backend `

Build APK for all the the system, splitted APKs by platform: "x86", "armeabi-v7a", "arm64-v8a"
`nx buildApk anyupp-mobile`

Build AppBundle for all the the systems in Android for Google Play Store comaptibility
`nx buildAppbundle anyupp-mobile`

Build IOS app
`nx buildIos anyupp-mobile`

**Deploy to App Center**

`nx publish-appcenter anyupp-mobile --platform=android`

- stage is `dev`, `qa`, `prod`
- platform is `android`, `ios`

The tool assumes that you have a valid appcenter token in the `APP_CENTER_TOKEN`
environment variable. The tool uses the current app image path, so
be careful: if you want to publish QA, then build the app with QA config, then
publish!

## Tools

### Reconfig the whole workspace

`./tools/build-workspace.sh ENVNAME STAGE`
Example using the dev stack
`./tools/build-workspace.sh anyupp-backend dev`

Ensure that all your changes are pushed or discard them. Because it will remove your local amplify folder.
The command fetches the crud backend, the configurations and regenerates the code files.
