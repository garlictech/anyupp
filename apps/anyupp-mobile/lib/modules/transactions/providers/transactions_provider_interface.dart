import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

abstract class ITransactionProvider {
  Future<PageResponse<Transaction>?> getTransactions({String? nextToken});
}
