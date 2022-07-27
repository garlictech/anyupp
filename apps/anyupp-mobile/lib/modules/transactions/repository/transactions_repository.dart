import 'dart:async';

import '/models/Transaction.dart';
import '/modules/transactions/providers/transactions_provider_interface.dart';
import '/shared/pagination/pagination.dart';

class TransactionsRepository {
  final ITransactionProvider _provider;

  TransactionsRepository(this._provider);

  Future<PageResponse<Transaction>?> getTransactions({String? nextToken}) {
    return _provider.getTransactions(
      nextToken: nextToken,
    );
  }
}
