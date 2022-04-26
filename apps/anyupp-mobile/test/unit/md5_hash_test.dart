// formatPackNumber

import 'package:fa_prev/shared/utils/md5_hash.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  void checkHashExpected(String source, String expected, [bool debug = true]) {
    String hash = generateHash(source);
    if (debug) print('source: $source, hash: $hash');
    expect(hash, equals(expected));
  }

  group('Testing MD5 hash generation for guest label...', () {
    test('Basic generation', () async {
      checkHashExpected(
        'f90e05c0-c146-11ec-96df-69d007d461d4',
        'c5124f',
      );
      checkHashExpected(
        '009a0c01-bbf5-11ec-9b13-bbc9692ef9aa',
        '5c7dda',
      );
    });
  });
}
