import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';

class AwsTransactionsProvider implements ITransactionProvider {
  final IAuthProvider _authProvider;

  AwsTransactionsProvider(this._authProvider);

  Future<List<Transaction>?> getTransactions() async {
    try {
      User? user = await _authProvider.getAuthenticatedUserProfile();
      if (user == null) {
        throw LoginException(
          code: LoginException.CODE,
          subCode: LoginException.USER_NOT_LOGGED_IN,
          message: 'User not logged in. getAuthenticatedUserProfile() is null',
        );
      }
      var result = await GQL.amplify.execute(ListTransactionsQuery(
          variables: ListTransactionsArguments(
        userId: user.id,
      )));

      if (result.data == null || result.data?.listTransactions == null) {
        return null;
      }

      var items = result.data?.listTransactions?.items ?? [];
      List<Transaction> transactions = [];
      for (int i = 0; i < items.length; i++) {
        transactions.add(Transaction.fromJson(items[i]!.toJson()));
      }

      return transactions;
    } on Exception catch (e) {
      print('AwsTransactionsProvider.listTransactions.Exception: $e');
      rethrow;
    }
  }
}
