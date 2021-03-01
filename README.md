# Anyupp

See the official nx docs below, let's start with the Anyupp-specific stuff.

## Configuring the project

Use the `config` build targets for projects requiring configuration. Configuration involves code generation processes as well.

Currently, the following packages can be configured:

**the graphql schema**

`nx config api-graphql-schema`

Whenever the schema changes, execeute the code generation phase for the clients.

**the configs (and secrets)**

`nx config shared-config`

When:

- you clone the github repo
- the config parameters change in the AWS Parameter Store or AWS Secret Manager
- you change the project stage (dev, prod, qa)

The command fetches the config parameters and writes them into files in `libs/shared/config`.
You need AWS credentials set in your environment with the appropriate access!

**IMPORTANT**

The configs are generated in `/libs/shared/config/src/lib/`. This folder is gitignored. Ensure that
the configs are NOT checked in to github otherwise you WILL experience differences
in your local and the remote environments.

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

All the reports and videos recording the test execution are generated in the `cyreport` folder of the project root. To generate a nice html report out of them:

```

yarn cucumber:report
```

then open `cyreport/cucumber_report.html` file with the browser. Enjoy!

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

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

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

### Generate a ??? (simple workspace lib)

`nx g @nrwl/workspace:lib shared/config`

### [Remove app or lib](https://nx.dev/latest/angular/plugins/workspace/generators/remove)

`nx g @nrwl/workspace:rm shared-config-firebase`

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
nx build infrastructure-anyupp-backend-stack
nx deploy infrastructure-anyupp-backend-stack

### Amplify - Admin

Generate amplify GQL models - this script moves the models folder into the lib folder
`yarn codegen:models`