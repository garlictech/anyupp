import 'package:fa_prev/models/Transaction.dart';

abstract class ITransactionProvider {
  Future<List<Transaction>?> getTransactions();
}
