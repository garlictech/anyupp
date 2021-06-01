import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

abstract class BaseGraphQLWrapper {

  Future<ValueNotifier<GraphQLClient>> get _client;

  Future<QueryResult> executeQuery({String query, Map<String, dynamic> variables}) async {
    ValueNotifier<GraphQLClient> client = await _client;
    try {
      QueryResult result = await client.value.query(QueryOptions(
        document: gql(QUERY_LIST_PRODUCT_CATEGORIES),
        variables: variables,
      ));
      if (result.hasException) {
        throw GraphQLException.fromException(GraphQLException.CODE, result.exception);
      }
      return result;
    } finally {
      client?.dispose();
    }
  }
}

class GqlAmplify extends BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> get _client async => getIt<GraphQLClientService>().getAmplifyClient();

}

class GqlGraphQL extends BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> get _client async => getIt<GraphQLClientService>().getGraphQLClient();
}
