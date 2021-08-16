import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/TransactionItem.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';

class AwsTransactionsProvider implements ITransactionProvider {
  final IAuthProvider _authProvider;

  AwsTransactionsProvider(this._authProvider);

  Future<List<TransactionItem>> getTransactions() async {
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      var result = await GQL.amplify.execute(ListTransactionsQuery(
          variables: ListTransactionsArguments(
        userId: user.id,
      )));
      // QueryResult result = await GQL.amplify.executeQuery(
      //   query: QUERY_LIST_TRANSACTIONS,
      //   variables: {
      //     'userId': user.id,
      //   },
      //   fetchPolicy: FetchPolicy.networkOnly,
      // );

      if (result.data == null || result.data.listTransactions == null) {
        return [];
      }

      var items = result.data.listTransactions.items;
      List<TransactionItem> transactions = [];
      for (int i = 0; i < items.length; i++) {
        transactions.add(TransactionItem.fromMap(items[i].toJson()));
      }
      // TODO should order in the query, not in here...
      transactions.sort((b, a) => a.createdAt.compareTo(b.createdAt));

      return transactions;
    } on Exception catch (e) {
      print('AwsTransactionsProvider.listTransactions.Exception: $e');
      rethrow;
    }
  }
}
