import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

abstract class _BaseGraphQLWrapper {
  Future<ValueNotifier<GraphQLClient>> get _client;

  Future<QueryResult> executeQuery({String query, Map<String, dynamic> variables, FetchPolicy fetchPolicy}) async {
    ValueNotifier<GraphQLClient> client = await _client;
    try {
      QueryResult result = await client.value.query(
        QueryOptions(
          document: gql(query),
          variables: variables,
          fetchPolicy: fetchPolicy,
        ),
      );
      if (result.hasException) {
        throw GraphQLException.fromException(GraphQLException.CODE_QUERY_EXCEPTION, result.exception);
      }
      return result;
    } finally {
      client?.dispose();
    }
  }

  Future<QueryResult> executeMutation({String mutation, Map<String, dynamic> variables, FetchPolicy fetchPolicy}) async {
    ValueNotifier<GraphQLClient> client = await _client;
    try {
      QueryResult result = await client.value.mutate(
        MutationOptions(
          document: gql(mutation),
          variables: variables,
          fetchPolicy: fetchPolicy,
        ),
      );
      if (result.hasException) {
        throw GraphQLException.fromException(GraphQLException.CODE_MUTATION_EXCEPTION, result.exception);
      }
      return result;
    } finally {
      client?.dispose();
    }
  }
}

class GQL {
  static _BaseGraphQLWrapper amplify = AmplifyApi();
  static _BaseGraphQLWrapper backend = BackendApi();
}

class AmplifyApi extends _BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> get _client async => getIt<GraphQLClientService>().getAmplifyClient();
}

class BackendApi extends _BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> get _client async => getIt<GraphQLClientService>().getGraphQLClient();
}
