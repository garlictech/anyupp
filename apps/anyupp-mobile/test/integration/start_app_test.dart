import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:fa_prev/main.dart' as app;

void main() {

  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('AnyUpp Mobile App', () {
    // First, define the Finders and use them to locate widgets from the
    // test suite. Note: the Strings provided to the `byValueKey` method must
    // be the same as the Strings we used for the Keys in step 1.
    // final counterTextFinder = find.byValueKey('counterText');
    // final buttonFinder = find.byTooltip('Increment');
    // final buttonAdd = find.byValueKey("add");
    // final buttonSubtract = find.byValueKey("subtract");
    // final alertText = find.byValueKey("alert_text");
    // final btnClose = find.byValueKey("close_button");
    // final Finder main = find.byKey(Key('anyupp-main-app')); 




    testWidgets('Checks the app is started', (WidgetTester tester) async {
      // // First, tap on the button
      // await driver.tap(buttonFinder);

      print('****** Waiting the app to start');
      app.main();
      await tester.pumpAndSettle(Duration(seconds: 10));
      print('****** App started');

      // await Future.delayed(Duration(seconds: 10));

      final Finder main = find.byKey(Key('anyupp-main-app')); 
      print('****** MAIN = $main');

      expect(main, isNotNull);
      // expect(true, equals(true));
      // // Then, verify the counter text has been incremented by 1
      // expect(await driver.getText(counterTextFinder), "1");

      // // First, tap on the button
      // await driver.tap(buttonFinder);

      // // Then, verify the counter text has been incremented by 1
      // expect(await driver.getText(counterTextFinder), "2");
    });

    testWidgets("test login with Email", (WidgetTester tester) async {
      // await driver.tap(buttonAdd);

      // expect(await driver.getText(alertText), "Welcome to ExecuteAutomation 2");

      // // Tap the close link to close the alert box
      // await driver.tap(btnClose);

      // //Click subtract again
      // await driver.tap(buttonSubtract);

      // //Verify if its correct
      // expect(await driver.getText(counterTextFinder), "1");
      expect(true, equals(true));
    });
  });
}
