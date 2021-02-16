# fa_prev

Mobile frontend for the 3FA mobile application (working title, brand name pending).

## Getting Started

## Create environment files

1. Create `.env` files in the `env` directory (`.env.dev`, `.env.prod`, `.env.qa`, `.env.staging` - these files are ignored from git, you have to ask for them)

```
SLACK_ERROR_WEBHOOK_URL=https://hooks.slack.com/services/***SECRET***
SLACK_ERROR_CHANNEL_NAME=slack-error-channel-name
stage=dev
region=europe-west3
qr-origin=https://dev.anyupp.com
```
   
## Set up your project

1. Add `google-services.json` to your `android/app` directory.
1. Add `GoogleService-Info.plist` to your `ios/Runner` directory.

## To better manage the various flutter versions use FVM

1. [Install dart](https://dart.dev/get-dart#install) probably without `flutter`, because we will use `fvm` to get the proper version of the flutter sdk, so install the standalone dart SDK, not the one that is already in a flutter sdk.
1. Install and activate `fvm` with the `pub global activate fvm` command (read more about this package manager at <https://pub.dev/packages/fvm> - keep in mind that there are multiple fvms!)
1. `fvm install` will install the right version for the project in case there is a valid `flutterSdkVersion` value in the `.fvm/fvm_config.json` file
1. `fvm flutter precache` to populates the Flutter tool's cache of binary artifacts.
1. Use `fvm flutter doctor` to check your environment for missing dependencies.
1. Set your `flutter.sdk` path in `android/local.properties` like so: `flutter.sdk=/Users/{your-user}/{path-to-the-project}/fa-prev/.fvm/flutter_sdk`

When using the `flutter` command, prefix it with `fvm` to use the local project version, ie.: `fvm flutter --version` which will always be the right version to use.

### OSX note

To run `fvm *` commands set the dart PATH to your .zshrc or .bash_profile file in case it is not already set.
`export PATH="$PATH":"$HOME/.pub-cache/bin"`

### iOS specifics

1. `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`
1. `sudo xcodebuild -runFirstLaunch`
1. Verify that the iOS simulator works with `open -a Simulator`

## Run the application

1. `fvm flutter clean` - just in case the repo is messy, at this time it could as well be
1. `fvm flutter doctor` - make sure all the relevant points are checked
1. `fvm flutter run -t ./lib/main_{stageName}.dart` - this might take some time, especially the first time (stageNames: dev|prod|qa|staging) OR use the `run` menu in VSCode

Finaly, make sure your iOS developer and device(s) are included in the team provisioning profile. Talk to Tamas or Konrad if you're unsure.

Ask to be included in the App Center tester group to get updates on your phone.

## Build the application
1. for iOS: `fvm flutter build ios -t ./lib/main_{stageName}.dart`
1. for Android: `fvm build apk --release --split-per-abi -t ./lib/main_{stageName}.dart` - it will generate 3 apks.

(stageNames: dev|prod|qa|staging)

## Optional errors:

1. `Can't load Kernel binary: Invalid SDK hash.`

Solution: run `pub global activate fvm` again

## Build GraphQL schema

1. Copy GraphQL schema to the root folder of the app (schema.graphql)
   1.a Or copy it from the endpoint: `get-graphql-schema http://localhost:3333/graphql  > schema.graphql`
2. Copy query, mutation and subscription client side definitions to {root}/graphql in SEPARATED FILES!
   Like:
    `
    Directory: .\fa-prev\graphql

    Mode                LastWriteTime         Length Name
    ----                -------------         ------ ----
    -a----    2021. 02. 04.     13:07            164 GetCustomerStripeCards.graphql
    -a----    2021. 02. 04.     13:07            149 StartStripePayment.graphql`

1. Optional: if you want to clean the generated classes: `flutter pub run build_runner clean`
2. run in command line: `flutter pub run build_runner build --delete-conflicting-outputs`
