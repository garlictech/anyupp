// formatPackNumber

import 'package:anyupp/shared/utils/format_utils.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  void testWithExpectedValue(double numberValue, String expectedStringValue) {
    String formattedPackSize = formatPackNumber(numberValue);
    expect(formattedPackSize, equals(expectedStringValue));
  }

  group(
      'Testing the pack formatter to display the product pack in the correct format...',
      () {
    test('Test 2 digit fraction with no zero endings', () async {
      testWithExpectedValue(1.23, '1.23');
      testWithExpectedValue(1.2999, '1.3');
      testWithExpectedValue(10.11, '10.11');
      testWithExpectedValue(99.99, '99.99');
      testWithExpectedValue(99.999, '100');
    });

    test('Test 2 digit fraction with 1 zero endings', () async {
      testWithExpectedValue(1.20, '1.2');
      testWithExpectedValue(1.2, '1.2');
      testWithExpectedValue(0.0, '0');
      testWithExpectedValue(99.9, '99.9');
      testWithExpectedValue(99.99999, '100');
      testWithExpectedValue(-99.99999, '-100');
    });

    test('Test 2 digit fraction with 2 zero endings', () async {
      testWithExpectedValue(1, '1');
      testWithExpectedValue(1.00, '1');
      testWithExpectedValue(0.0, '0');
      testWithExpectedValue(99, '99');
      testWithExpectedValue(100, '100');
      testWithExpectedValue(-1, '-1');
    });
  });
}
