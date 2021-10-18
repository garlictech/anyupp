import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

import 'mock_data_faker.dart';

class MockTransactionRepository implements ITransactionProvider {
  final int pageSize = 10;

  List<Transaction> mockTransactions = MockGenerator.generateTransactions(
    count: 100,
    userId: 'TEST_USER_ID',
    orderId: 'TEST_ORDER_ID',
  );

  Future<PageResponse<Transaction>> loadNextPage({String? nextToken, int pageSize = 10}) async {
    print('MockTransactionRepository.loadNextPage().token=$nextToken, pageSize=$pageSize');
    if (nextToken == null) {
      return PageResponse(
        data: mockTransactions.sublist(0, pageSize),
        nextToken: mockTransactions.length < pageSize ? null : mockTransactions[pageSize - 1].id,
        totalCount: pageSize,
      );
    }

    int startIndex = mockTransactions.indexWhere((element) => nextToken == element.id);
    if (startIndex == -1) {
      return PageResponse(
        data: null,
        nextToken: null,
        totalCount: 0,
      );
    }

    return PageResponse(
      data: mockTransactions.sublist(startIndex, pageSize),
      nextToken:
          mockTransactions.length < startIndex + pageSize ? null : mockTransactions[startIndex + pageSize - 1].id,
      totalCount: startIndex + pageSize,
    );
  }

  @override
  Future<PageResponse<Transaction>?> getTransactions({String? nextToken}) async {
    print('MockTransactionRepository.loadNextPage().token=$nextToken, pageSize=$pageSize');
    if (nextToken == null) {
      return PageResponse(
        data: mockTransactions.sublist(0, pageSize),
        nextToken: mockTransactions.length < pageSize ? null : mockTransactions[pageSize - 1].id,
        totalCount: pageSize,
      );
    }

    int startIndex = mockTransactions.indexWhere((element) => nextToken == element.id);
    if (startIndex == -1) {
      return PageResponse(
        data: null,
        nextToken: null,
        totalCount: 0,
      );
    }

    return PageResponse(
      data: mockTransactions.sublist(startIndex, pageSize),
      nextToken:
          mockTransactions.length < startIndex + pageSize ? null : mockTransactions[startIndex + pageSize - 1].id,
      totalCount: startIndex + pageSize,
    );
  }
}
