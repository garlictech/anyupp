import 'dart:async';

import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/modules/transactions/providers/transactions_provider_interface.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

class TransactionsRepository {
  final ITransactionProvider _provider;

  TransactionsRepository(this._provider);

  Future<PageResponse<Transaction>?> getTransactions({String? nextToken}) {
    return _provider.getTransactions(
      nextToken: nextToken,
    );
  }
}
