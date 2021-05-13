import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/graphql/graphql_client_service.dart';
import 'package:fa_prev/graphql/queries/list_transactions.dart';

import 'package:fa_prev/models/TransActionItem.dart';
import 'package:fa_prev/models/User.dart';
import 'package:fa_prev/modules/transactions/providers/transactions_provider_interface.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:flutter/cupertino.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsTransactionsProvider implements ITransactionProvider {
  final IAuthProvider _authProvider;

  AwsTransactionsProvider(this._authProvider);

  Future<List<TransactionItem>> getTransactions(String unitId) async {
    print('_getFavorites().unitId=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      ValueNotifier<GraphQLClient> _client =
          await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_LIST_TRANSACTIONS),
        // variables: {
        //   'userId': user.id,
        // //  'unitId': unitId,
        // },
        fetchPolicy: FetchPolicy.networkOnly,
      ));
      // print('_getFavorites().result.data=${result.data}');

      if (result.hasException) {
        print('getTransactions().result.exception=${result.exception}');
        // throw result.exception;
        return [];
      }

      List<dynamic> items = result.data['listTransactions']['items'];

      List<TransactionItem> transactions = [];
      for (int i = 0; i < items.length; i++) {
        transactions
            .add(TransactionItem.fromMap(Map<String, dynamic>.from(items[i])));
      }

      // print('***** getFavoritesList().favorites=$favorites');
      return transactions;
    } on Exception catch (e) {
      print('AwsTransactionsProvider.listTransactions.Exception: $e');
      rethrow;
    }
  }
}
