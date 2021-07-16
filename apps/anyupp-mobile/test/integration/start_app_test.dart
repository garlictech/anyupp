import 'package:fa_prev/main.dart' as app;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  group('AnyUpp Mobile App', () {
    // setUpAll(() async {
    //   IntegrationTestWidgetsFlutterBinding.ensureInitialized();
    // });
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
      await tester.pumpAndSettle(Duration(seconds: 5));
      print('****** App started');
      // await Future.delayed(Duration(seconds: 10));
      final Finder main = find.byKey(Key('anyupp-main-app'));
      // print('****** MAIN = ${main.description}');
      // await tester.pumpAndSettle();
      expect(main, isNotNull);
      await tester.pumpAndSettle(Duration(seconds: 20));
      // await Future.delayed(Duration(seconds: 15));
      final Finder loginBtn = find.byKey(Key('login-btn-anonymous'));
      print('****** loginBtn = ${loginBtn.description}');
      expect(loginBtn, isNotNull);
      await tester.tap(find.byKey(Key('login-btn-anonymous')));
       await tester.pump(Duration(seconds: 15));
     // await tester.pump();
      final Finder unitSelectSreen = find.byKey(Key('unitselect-screen'));
      // print('****** loginBtn = ${loginBtn.description}');
      expect(unitSelectSreen, isNotNull);    //   final Finder unitWidget = find.byKey(Key('unit-widget'));
    //   expect(unitWidget, isNotNull);
    //      print('****** Tap unit widget ');
    //   await tester.tap(unitWidget);
    //   await tester.pump(Duration(seconds: 10));
    //  print('****** search Profile');

    //   expect(
    //     find.byWidgetPredicate((widget) =>
    //         widget is BottomBarItem &&
    //         widget.text is Text &&
    //         (widget.text as Text).data.startsWith("Profile")),
    //     findsOneWidget);

      // final Finder barItemFinder = find.ancestor(
      //     of: find.text("Profile"),
      //     matching:
      //         find.byWidgetPredicate((widget) => widget is BottomBarItem));
      // expect(barItemFinder, isNotNull);

      // print('****** loginBtn = ${loginBtn.description}');
    });
    // testWidgets("test login with Anonymously", (WidgetTester tester) async {
    //   await tester.pumpAndSettle(Duration(seconds: 15));
    //   final Finder loginBtn = find.byKey(Key('login-btn-anonymous'));
    //   print('****** loginBtn = ${loginBtn.description}');
    //   expect(loginBtn, isNotNull);
    //   await tester.tap(find.byKey(Key('login-btn-anonymous')));
    //   await tester.pumpAndSettle();
    // });
    // testWidgets("checks that we are on the Unit Selection screen", (WidgetTester tester) async {
    //   await tester.pump(Duration(seconds: 5));
    //   final Finder unitSelectSreen = find.byKey(Key('unitselect-screen'));
    //   // print('****** loginBtn = ${loginBtn.description}');
    //   expect(unitSelectSreen, isNotNull);
    // });
  });
}
