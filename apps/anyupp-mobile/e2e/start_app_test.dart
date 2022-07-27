import '/core/logger.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import '/main.dart' as app;

final IntegrationTestWidgetsFlutterBinding binding =
    IntegrationTestWidgetsFlutterBinding();

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('AnyUpp Mobile App - Checks the app is started',
      (WidgetTester tester) async {
    // // First, tap on the button
    // await driver.tap(buttonFinder);
    await tester.runAsync(() async {
      app.main();
      await tester.pumpAndSettle();
    }).then((value) async {
      // expect(find.text('Test 1 Done!'), findsOneWidget);
      // expect(find.text('Test 2 Done!'), findsOneWidget);
      log.d('****** Waiting the app to start');
      // await tester.pumpAndSettle(Duration(seconds: 20));
      log.d('****** App started');

      // await Future.delayed(Duration(seconds: 10));
      log.d('****** Restoring flutter onError: ${FlutterError.onError}');
      FlutterError.onError = (_) => Null;

      final Finder main = find.byKey(Key('anyupp-main-app'));
      log.d('****** MAIN = ${main.description}');
      expect(main, isNotNull);
      await tester.pumpAndSettle(Duration(seconds: 5));
      // await tester.pump(Duration(seconds: 10));
      // await tester.pump(Duration(seconds: 5));
      // await tester.pump(Duration(seconds: 2));
      // await tester.pump(Duration(seconds: 2));

      final Finder loginBtn = find.byKey(Key('login-btn-anonymous'));
      log.d('****** loginBtn = ${loginBtn.description}');
      expect(loginBtn, isNotNull);
      // await binding.takeScreenshot('screenshot-${DateTime.now()}');

      // await tester.pump();
      await tester.tap(loginBtn);
      // await tester.pump(Duration(seconds: 3));
      // await tester.pump(Duration(seconds: 3));
      await tester.pump();

      final Finder unitSelectSreen = find.byKey(Key('unitselect-screen'));
      log.d('****** unitSelectSreen = ${unitSelectSreen.description}');
      expect(unitSelectSreen, isNotNull);
    });
  });

  testWidgets('AnyUpp Mobile App - Checks the app is started 2',
      (WidgetTester tester) async {
    // // First, tap on the button
    // await driver.tap(buttonFinder);
    await tester.runAsync(() async {
      app.main();
      await tester.pumpAndSettle();
    }).then((value) async {
      log.d('****** Waiting the app to start');
      log.d('****** App started');

      log.d('****** Restoring flutter onError: ${FlutterError.onError}');
      FlutterError.onError = (_) => Null;

      final Finder main = find.byKey(Key('anyupp-main-app'));
      log.d('****** MAIN = ${main.description}');
      expect(main, isNotNull);
      await tester.pumpAndSettle(Duration(seconds: 5));
      await tester.pumpAndSettle(Duration(seconds: 5));

      final Finder loginBtn = find.byKey(Key('login-btn-anonymous'));
      log.d('****** loginBtn = ${loginBtn.description}');
      expect(loginBtn, isNotNull);
      // await binding.takeScreenshot('screenshot-${DateTime.now()}');

      await tester.tap(loginBtn);
      // await tester.pumpAndSettle(Duration(seconds: 2));
      await tester.pumpAndSettle(Duration(seconds: 2));

      final Finder unitSelectSreen = find.byKey(Key('unitselect-screen'));
      log.d('****** unitSelectSreen = ${unitSelectSreen.description}');
      expect(unitSelectSreen, isNotNull);
      // await tester.pumpAndSettle(Duration(seconds: 5));
    });
  }, skip: true);
}
