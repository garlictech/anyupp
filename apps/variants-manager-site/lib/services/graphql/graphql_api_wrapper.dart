import 'dart:convert';

import '../awsconfiguration.dart';
import '/services/cognito_service.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart' hide JsonSerializable;

import 'graphql_client_service.dart';

abstract class _BaseGraphQLWrapper {
  Future<ValueNotifier<GraphQLClient>> _getClient({bool useApi = false});

  Future<GraphQLClient> get client async => (await _getClient()).value;

  Future<dynamic> execute(String document,
      {Map<String, dynamic> variables = const {},
      FetchPolicy? fetchPolicy,
      bool useApi = false}) async {
    ValueNotifier<GraphQLClient> client = await _getClient(useApi: useApi);
    try {
      QueryResult response = await client.value.query(
        QueryOptions(
          document: gql(document),
          variables: variables,
          fetchPolicy: fetchPolicy,
        ),
      );
      return response.data ?? {};
    } catch (e) {
      debugPrint('GraphQL.execute.error=$e');
      rethrow;
    } finally {
      client.dispose();
    }
  }
}

class AmplifyApi extends _BaseGraphQLWrapper {
  final CognitoService cognitoService;

  AmplifyApi({required this.cognitoService});

  @override
  Future<ValueNotifier<GraphQLClient>> _getClient({bool useApi = false}) async {
    final config = jsonDecode(AWSCONFIG);
    final service = GraphQLClientService(
        authProvider: cognitoService,
        amplifyApiUrl: config["CrudGraphqlApiUrl"],
        amplifyApiKey: config["CrudGraphqlApiKey"]);

    return service.getCrudClient(useApi: useApi);
  }
}
