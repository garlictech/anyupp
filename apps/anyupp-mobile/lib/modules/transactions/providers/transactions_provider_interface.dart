import '/models/Transaction.dart';
import '/shared/pagination/pagination.dart';

abstract class ITransactionProvider {
  Future<PageResponse<Transaction>?> getTransactions({String? nextToken});
}
