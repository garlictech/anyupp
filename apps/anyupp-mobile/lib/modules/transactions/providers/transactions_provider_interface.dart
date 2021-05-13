
import 'package:fa_prev/models/TransActionItem.dart';

abstract class ITransactionProvider {
  Future<List<TransactionItem>> getTransactions(String unitId);
}
