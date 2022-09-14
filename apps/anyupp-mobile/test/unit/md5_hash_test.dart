import 'package:anyupp/shared/utils/md5_hash.dart';
import 'package:flutter_test/flutter_test.dart';
import '../test_logger.dart';

void main() {
  void checkHashExpected(String source, String expected, [bool debug = false]) {
    String hash = generateHash(source);
    if (debug) tlog.d('source: $source, hash: $hash');
    expect(hash, equals(expected));
  }

  group('Testing MD5 hash generation for guest label...', () {
    test('Basic generation', () async {
      checkHashExpected(
        'f90e05c0-c146-11ec-96df-69d007d461d4',
        'C5124F',
      );
      checkHashExpected(
        '009a0c01-bbf5-11ec-9b13-bbc9692ef9aa',
        '5C7DDA',
      );
    });
  });
}
