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
    // final Function(FlutterErrorDetails) original = FlutterError.onError;


    testWidgets('Checks the app is started', (WidgetTester tester) async {
      // // First, tap on the button
      // await driver.tap(buttonFinder);

      print('****** Waiting the app to start');
      app.main();
      await tester.pumpAndSettle(Duration(seconds: 10));
      print('****** App started');

      // await Future.delayed(Duration(seconds: 10));
      print('****** Restoring flutter onError');
      // FlutterError.onError = original;

      final Finder main = find.byKey(Key('anyupp-main-app'));
      print('****** MAIN = ${main.description}');
      await tester.pump();

      expect(main, isNotNull);
    });

    testWidgets("test login with Email", (WidgetTester tester) async {

      expect(true, equals(true));
    });
  });
}
