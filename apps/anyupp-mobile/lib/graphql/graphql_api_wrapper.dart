import 'package:artemis/artemis.dart';
import '/core/core.dart';
import '/graphql/graphql.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart' hide JsonSerializable;
import 'package:json_annotation/json_annotation.dart';

abstract class _BaseGraphQLWrapper {
  Future<ValueNotifier<GraphQLClient>> _getClient({bool useApi = false});

  Future<GraphQLClient> get client async => (await _getClient()).value;

  Stream<GraphQLResponse<T>> stream<T, U extends JsonSerializable>(
    GraphQLQuery<T, U> query, {
    required GraphQLClient client,
    Context context = const Context(),
  }) {
    return client
        .subscribe(
          SubscriptionOptions(
            document: query.document,
            variables: query.variables?.toJson() ?? const {},
            fetchPolicy: FetchPolicy.networkOnly,
          ),
        )
        .map(
          (response) => GraphQLResponse<T>(
            data:
                response.data == null ? null : query.parse(response.data ?? {}),
            errors: response.exception?.graphqlErrors,
            context: response.context,
          ),
        );
  }

  Future<GraphQLResponse<T>> execute<T, U extends JsonSerializable>(
      GraphQLQuery<T, U> query,
      {FetchPolicy? fetchPolicy,
      bool useApi = false}) async {
    ValueNotifier<GraphQLClient> client = await _getClient(useApi: useApi);
    try {
      QueryResult response = await client.value.query(
        QueryOptions(
          document: query.document,
          variables: query.variables?.toJson() ?? const {},
          fetchPolicy: fetchPolicy,
        ),
      );
      // if (response.hasException) {
      //   throw GraphQLException.fromOperationException(GraphQLException.CODE_QUERY_EXCEPTION, response.exception);
      // }
      return GraphQLResponse<T>(
        data: response.data == null ? null : query.parse(response.data ?? {}),
        errors: response.exception?.graphqlErrors,
        context: response.context,
      );
    } catch (e) {
      log.e('GraphQL.execute.error=$e');
      rethrow;
    } finally {
      client.dispose();
    }
  }
}

class GQL {
  static _BaseGraphQLWrapper amplify = AmplifyApi();
  // static _BaseGraphQLWrapper backend = BackendApi();
}

class AmplifyApi extends _BaseGraphQLWrapper {
  @override
  Future<ValueNotifier<GraphQLClient>> _getClient(
          {bool useApi = false}) async =>
      getIt<GraphQLClientService>().getCrudClient(useApi: useApi);
}
