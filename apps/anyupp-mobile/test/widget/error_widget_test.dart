import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Test Common Error widget', (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.pumpWidget(MaterialApp(
      home: const CommonErrorWidget(
        error: 'TEST_ERROR_CODE',
        description: 'TEST_ERROR_DESCRIPTION',
        errorDetails: 'TEST_ERROR_DETAILS',
      ),
    ));

    final errorFinder = find.text('TEST_ERROR_CODE');
    final descriptionFinder = find.text('TEST_ERROR_DESCRIPTION');
    final detailsFinder = find.text('TEST_ERROR_DETAILS');

    // Use the `findsOneWidget` matcher provided by flutter_test to verify
    // that the Text widgets appear exactly once in the widget tree.
    expect(errorFinder, findsOneWidget);
    expect(descriptionFinder, findsOneWidget);
    expect(detailsFinder, findsOneWidget);
  });
}
