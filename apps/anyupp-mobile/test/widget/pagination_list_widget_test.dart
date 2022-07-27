import '/models.dart';
import '/modules/transactions/transactions.dart';
import '/shared/pagination/pagination.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../test_logger.dart';
import 'mock/mock_transaction_repository.dart';

void main() {
  late MockTransactionRepository _repository;
  final DateFormat parser = DateFormat("yyyy-MM-dd HH:mm:ss.SSS");
  final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
  String? _nextToken;

  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    _repository = MockTransactionRepository();
  });

  Future<PageResponse<Transaction>> loadNextPage(String? nextToken) async {
    var result = await _repository.loadNextPage(nextToken: nextToken);
    _nextToken = result.nextToken;
    tlog.d('loadNextPage.result._nextToken=$_nextToken');
    return result;
  }

  Widget renderListItemWidget(Transaction transaction) {
    tlog.d('renderListItemWidget()=${transaction.id}');
    // return TransactionInfoWidget(item);
    return TransactionCard(transaction: transaction);
  }

  testWidgets('Test Pagination list widget', (WidgetTester tester) async {
    // Create the widget by telling the tester to build it.
    await tester.pumpWidget(MaterialApp(
      home: PaginationListWidget<Transaction>(
        loadNextPage: (token) => loadNextPage(token),
        renderListItemWidget: (transaction) =>
            renderListItemWidget(transaction),
      ),
    ));

    await tester.pump();

    DateTime? dateTime = _repository.mockTransactions[0].createdAt != null
        ? parser.parseUTC(_repository.mockTransactions[0].createdAt!)
        : null;
    String dateString =
        dateTime == null ? '-' : formatter.format(dateTime.toLocal());
    tlog.d('DateTimeString=$dateString');

    //find.

    // final errorFinder = find.text('TEST_ERROR_CODE');
    // final descriptionFinder = find.text('TEST_ERROR_DESCRIPTION');
    // final detailsFinder = find.text('TEST_ERROR_DETAILS');

    // // Use the `findsOneWidget` matcher provided by flutter_test to verify
    // // that the Text widgets appear exactly once in the widget tree.
    // expect(errorFinder, findsOneWidget);
    // expect(descriptionFinder, findsOneWidget);
    // expect(detailsFinder, findsOneWidget);
  }, skip: true);
}
