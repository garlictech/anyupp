import 'dart:math';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

import '../../mock/mock_data_faker.dart';
import '../../test_logger.dart';

class MockTransactionProvider implements ITransactionProvider {
  final int pageSize;

  late List<Transaction> mockTransactions;

  MockTransactionProvider({this.pageSize = 10, int itemCount = 30}) {
    mockTransactions = MockGenerator.generateTransactions(
      count: itemCount,
      userId: 'TEST_USER_ID',
      orderId: 'TEST_ORDER_ID',
    );
  }

  @override
  Future<PageResponse<Transaction>?> getTransactions(
      {String? nextToken}) async {
    tlog.d('MockTransactionRepository.token=$nextToken, pageSize=$pageSize');
    if (nextToken == null) {
      return PageResponse(
        data: mockTransactions.sublist(0, pageSize),
        nextToken: mockTransactions.length < pageSize
            ? null
            : mockTransactions[pageSize - 1].id,
        totalCount: pageSize,
      );
    }

    int tokenIndex =
        mockTransactions.indexWhere((element) => nextToken == element.id);
    tlog.d('MockTransactionRepository.startIndex=$tokenIndex');
    if (tokenIndex == -1) {
      return PageResponse(
        data: null,
        nextToken: null,
        totalCount: 0,
      );
    }

    var startIndex = tokenIndex + 1;
    var endIndex = min(mockTransactions.length - 1, startIndex + pageSize);
    var token = mockTransactions[endIndex - 1].id;
    var totalCount = mockTransactions.length; //endIndex + 1;
    if (endIndex - startIndex != pageSize) {
      token = null;
    }

    return PageResponse(
      data: mockTransactions.sublist(startIndex, endIndex),
      nextToken: token,
      totalCount: totalCount,
    );
  }
}
