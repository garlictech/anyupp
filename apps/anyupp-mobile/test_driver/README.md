# How to run e2e tests

### Prerequisities

These are the required applications and SDK-s to run the E2E tests on real device or emulator.

#### Global

1. Flutter SDK installed, configured etc...

#### Android emulator

1. Installed Android SDK
2. Emulator created by Android AVD (Android Virtual Device)

#### IOS (emulator)

1. Mac computer
2. Installed XCode

### Steps

```
flutter drive --driver=test_driver/integration_test.dart --target=integration_test/start_app_test.dart -d <DEVICE_ID>
```
