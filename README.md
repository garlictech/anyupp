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

## Configuring the project

Use the `config` build targets for projects requiring configuration.
Configuration involves code generation processes as well.

Currently, the following packages can be configured:

**the graphql schema**

`nx config api-graphql-schema`

Whenever the schema changes, you must execute the code generation phase for the
clients.

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

### Option 1: Create everything from scratch

After cloning the repo, configure your environment. You need the following environment variables:

```
export AWS_PROFILE=anyupp
export EDITORNAME=vim
```

... if, for a reason, you don't like vim, use something else, VScode is `code`. Any editor command works.

Then, create an amplify app for admin:

`nx init admin-amplify-app --app APPNAME --stage STAGE` :exclamation: use your own app name

The stuff writes the amplify app id to parameter store, CDK will use it to fetch
the amplify resources.

**WARNING** The command above overwrites the amplify app id belonging to the CDK
stack in the Parameter Store!

Unfortunately, the SST tools we use to deploy the CDK stack do not support app name parametrization, so:

- in `apps/infrastructure/anyupp-backend-stack/sst.json`, write your app name
  to the "name" field
- in `infrastructure/anyupp-backend-stack/serverless.yml`, use the same name
  in the `service` field
- build and deploy the stack to the desired stage (it will use the stage-related
  parameters, secrets, etc:)

:exclamation: use your own app name

```
nx build infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev
nx deploy infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev
```

**Be careful** and do NOT check in the mentioned two config files!

Ok, now we have an amplify app and a CDK stack, and they know about each other.
Finish configuring amplify, by adding the previously created Cognito resources and
the API. Unfortunately, the procedure is not fully automated, as the add/import commands
are not yet supported in headless mode :( So fill in the forms if required.

Cognito part:

```
cd apps/admin-amplify-app
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
Answere these questions

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
- ? Provide your schema file path: `../../libs/api/graphql/schema/src/schema/admin-api.graphql`

Then, it pushes the app, and generates code. Code generation steps:

- ? Do you want to generate code for your newly created GraphQL API `Yes`
- ? Choose the code generation language target `typescript`
- ? Enter the file name pattern of graphql queries, mutations and subscriptions `../../libs/admin/amplify-api/src/lib/generated/graphql/**/*.graphql`
- ? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions `Yes`
- ? Enter maximum statement depth [increase from default if your schema is deeply nested] `10`
- ? Enter the file name for the generated code `../../libs/admin/amplify-api/src/lib/generated/api.ts`
- ? Do you want to generate code for your newly created GraphQL API `Yes`

Then, answer `yes` to the _code generation/code overwrite_ questions.

So, for auth, add API key, IAM and user pool options. Select the annotated schema file
from your source tree.

**WARNING** always synchronize the schema files between amplify and github! When you
change the schema, apply the changes to `libs/api/graphql/schema/src/schema/admin-api.graphql`
as well!

### Option 2: Configure your project with existing resources

You should use this option when you clone the repo or change app stack and/or stage.
Mind, that this method assumes that you followed the naming convention in the previous section,
you need to configure full arbitrary resources, then you are on your own: check resource id-s
in the AWS console, use the shell scripts behind the angular commands as hints.

First, pull the admin amplify app:

`nx config admin-amplify-app --app APPNAME --stage STAGE` :exclamation: use your own app name

It pulls the admin Amplify project and connects it to the actual CDK resources.

## Building the project

Like the config stage, we have to tell the system which stack (app) and stage you
are working with. So the build/deploy commands support the `app` and `stage`
parameters.

Or, they should support it if needed, we have to add this support gradually. For
some samples, see the build targets belonging to the examples in the
`angular.json`.

### Build the amplify app

`nx config-schema amplify-admin-api --stage dev`

The command builds the _current_ configured app / stage.

**IMPORTANT**: the build overwrites the schema with the current github schema!

Deploy the current app/stage:

`nx deploy amplify-admin-api`

To build the admin site for a given configuration:

Building the stack:

`nx build infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev` :exclamation: use your own app name

Deploying the stack:

`nx deploy infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev` :exclamation: use your own app name

## Deleting the stack

Destroy the admin amplify app:

`nx remove admin-amplify-app`

**WARNING**: the command destroys the amplify app that is currently pulled! Both the local
and the backend resources so be careful.

Then, remove the CDK stack:

`nx remove infrastructure-anyupp-backend-stack --stage ${STAGE}`

**WARNING** it removes the given stage of the app currently set in `sst.json`.

## Manual testing the project

The deployed admin sites:

- DEV: https://dev.admin.anyupp-backend.anyupp.com/
- QA: https://qa.admin.anyupp-backend.anyupp.com/

Both systems have some minimal data seeded at deploy/creation time.

**IMPORTANT**: the seed process is executed only when the seed stack or its
dependencies deployed/modified!

- A test user: username: `test@test.com`, password: `Testtesttest12_`

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

`yarn jest -c libs/integration-tests/jest.config.js libs/integration-tests/src/lib/backend-seed.spec.ts`

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

1. Set stage name in apps/infrastructure/anyupp-backend-stack/sst.json (e.g. dev-petrot)

2. Download own config:
   `yarn ts-node ./tools/fetch-configuration.ts anyupp-backend dev-petrot`

3. Build & deploy
   nx build infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev
   nx deploy infrastructure-anyupp-backend-stack --app=APPNAME --stage=dev

### Amplify - Admin

Generate amplify GQL models - this script moves the models folder into the lib folder
`yarn codegen:models`
