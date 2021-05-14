


import 'package:fa_prev/models/TransactionItem.dart';

abstract class ITransactionProvider {
  Future<List<TransactionItem>> getTransactions(String unitId);
}
