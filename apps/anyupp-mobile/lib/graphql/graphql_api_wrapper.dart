import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

abstract class _BaseGraphQLWrapper {
  Future<ValueNotifier<GraphQLClient>> _getClient({bool useApi = false});

  Future<QueryResult> executeQuery(
      {String query,
      Map<String, dynamic> variables,
      FetchPolicy fetchPolicy}) async {
    ValueNotifier<GraphQLClient> client = await _getClient();
    try {
      QueryResult result = await client.value.query(
        QueryOptions(
          document: gql(query),
          variables: variables,
          fetchPolicy: fetchPolicy,
        ),
      );
      if (result.hasException) {
        throw GraphQLException.fromOperationException(
            GraphQLException.CODE_QUERY_EXCEPTION, result.exception);
      }
      return result;
    } finally {
      client?.dispose();
    }
  }

  Future<QueryResult> executeMutation(
      {String mutation,
      Map<String, dynamic> variables,
      FetchPolicy fetchPolicy,
      bool useApi = false}) async {
    ValueNotifier<GraphQLClient> client = await _getClient(useApi: useApi);
    try {
      QueryResult result = await client.value.mutate(
        MutationOptions(
          document: gql(mutation),
          variables: variables,
          fetchPolicy: fetchPolicy,
        ),
      );
      if (result.hasException) {
        throw GraphQLException.fromOperationException(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.exception);
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
  Future<ValueNotifier<GraphQLClient>> _getClient(
          {bool useApi = false}) async =>
      getIt<GraphQLClientService>().getCrudClient();
  @override
  Future<QueryResult> executeQuery(
      {String query,
      Map<String, dynamic> variables,
      FetchPolicy fetchPolicy}) async {
    try {
      return super.executeQuery(query: query, variables: variables, fetchPolicy: fetchPolicy);
    } on GraphQLException catch (e) {
      throw GraphQLException.fromCrudException(e);
    }
  }

  @override
  Future<QueryResult> executeMutation(
      {String mutation,
      Map<String, dynamic> variables,
      FetchPolicy fetchPolicy,
      bool useApi = false}) async {
    try {
      return super.executeMutation(
          mutation: mutation,
          variables: variables,
          fetchPolicy: fetchPolicy,
          useApi: useApi);
    } on GraphQLException catch (e) {
      throw GraphQLException.fromCrudException(e);
    }
  }
}

class BackendApi extends _BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> _getClient(
          {bool useApi = false}) async =>
      getIt<GraphQLClientService>().getAnyuppClient(useApi: useApi);
}
