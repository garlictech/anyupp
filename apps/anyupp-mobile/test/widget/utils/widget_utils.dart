import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void checkTextValue(String key, String expectedValue) {
  // Find text widget
  Finder textFinder = find.byKey(Key(key));
  expect(textFinder, findsOneWidget);

  // Get the text from the text widget
  var textWidget = textFinder.evaluate().single.widget as Text;
  expect(textWidget, isNotNull);

  // tlog.d('${textWidget.data?.characters} vs ${expectedValue.characters}');
  // tlog.d('${textWidget.data?.codeUnits} vs ${expectedValue.codeUnits}');

  expect(textWidget.data, equals(expectedValue));
}
