import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/transactions/transactions.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

class AwsTransactionsProvider implements ITransactionProvider {
  final IAuthProvider _authProvider;

  AwsTransactionsProvider(this._authProvider);

  Future<PageResponse<Transaction>?> getTransactions(
      {String? nextToken}) async {
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
        nextToken: nextToken,
      )));

      if (result.data == null || result.data?.searchTransactions == null) {
        return null;
      }

      int count = result.data?.searchTransactions?.total ?? 0;
      String? token = result.data?.searchTransactions?.nextToken;

      var items = result.data?.searchTransactions?.items ?? [];
      List<Transaction> transactions = [];
      for (int i = 0; i < items.length; i++) {
        transactions.add(Transaction.fromJson(items[i]!.toJson()));
      }

      return PageResponse(
        data: transactions,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      print('AwsTransactionsProvider.listTransactions.Exception: $e');
      rethrow;
    }
  }
}
