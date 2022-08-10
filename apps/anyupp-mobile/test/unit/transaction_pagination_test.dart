import 'package:anyupp/modules/transactions/transactions.dart';
import 'package:flutter_test/flutter_test.dart';
import 'mock/mock_transaction_provider.dart';

void main() {
  group('Translation list pagination test...', () {
    int pageSize = 10;
    int itemCount = 102;
    ITransactionProvider? _provider;
    String? _nextToken;

    setUpAll(() async {
      _nextToken = null;
      expect(_provider, isNull);

      _provider = MockTransactionProvider(
        pageSize: pageSize,
        itemCount: itemCount,
      );
      expect(_provider, isNotNull);
    });

    test('Test pagination on Transaction repository', () async {
      expect(_nextToken, isNull);
      var result = await _provider!.getTransactions(
        nextToken: _nextToken,
      );
      expect(result, isNotNull);
      expect(result!.data, isNotNull);
      expect(result.nextToken, isNotNull);
      expect(result.totalCount, isNotNull);

      _nextToken = result.nextToken;

      do {
        result = await _provider!.getTransactions(
          nextToken: _nextToken,
        );
        expect(result, isNotNull);

        _nextToken = result!.nextToken;

        if (result.nextToken != null) {
          expect(result.data, isNotNull);
          expect(result.nextToken, isNotNull);
          expect(result.totalCount, isNotNull);
        } else {
          expect(result.nextToken, isNull);
          expect(result.totalCount, isNotNull);
        }
      } while (result.nextToken != null);
    }, skip: false);
  });
}
