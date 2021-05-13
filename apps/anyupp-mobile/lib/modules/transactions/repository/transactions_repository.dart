import 'dart:async';

import 'package:fa_prev/models/TransActionItem.dart';
import 'package:fa_prev/modules/transactions/providers/transactions_provider_interface.dart';

class TransactionsRepository {
  final ITransactionProvider _provider;

  TransactionsRepository(this._provider);

  Future<List<TransactionItem>> getTransactions(String unitId) {
    return _provider.getTransactions(unitId);
  }
}
