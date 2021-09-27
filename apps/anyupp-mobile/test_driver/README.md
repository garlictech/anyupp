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

### Run Tests

#### Unit

Unit tests have no external dependencies

```
flutter test test/unit/user_details_bloc_test.dart
```

#### Integration

Integration tests could have external dependencies. These tests could write and read from the Database, etc.

To run all the int tests

```
flutter test test/integration_test
```

To run a single file

```
flutter test test/integration_test/order_pagination_test.dart
```

#### Widget

> A widget test (in other UI frameworks referred to as component test) tests a single widget. The goal of a widget test is to verify that the widget’s UI looks and interacts as expected

```
flutter test test/widget/error_widget_test.dart
```

#### E2E (Integration test in Flutter terminology)

> An E2E test tests a complete app or a large part of an app. The goal of an E2E test is to verify that all the widgets and services being tested work together as expected. Furthermore, you can use E2E tests to verify your app’s performance.

```
flutter drive --driver=test_driver/integration_test.dart --target=e2e/start_app_test.dart -d <DEVICE_ID>
```
