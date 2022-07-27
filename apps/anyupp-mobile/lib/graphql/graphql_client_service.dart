import 'dart:convert';

import 'package:dio/dio.dart';
import '/core/core.dart';
import '/shared/auth/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:gql_dio_link/gql_dio_link.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_request_serializer.dart';
import 'graphql_token_refresh_interceptor.dart';
// import 'graphql_token_refresh_interceptor.dart';

class GraphQLClientService {
  final String amplifyApiUrl;
  final String amplifyApiKey;
  final IAuthProvider authProvider;

  final _dio = Dio();

  GraphQLClientService({
    required this.authProvider,
    required this.amplifyApiUrl,
    required this.amplifyApiKey,
  }) {
    _dio.interceptors.add(DioTokenInterceptor(_dio, this.authProvider));
  }

  Future<ValueNotifier<GraphQLClient>> getCrudClient(
      {bool useApi = false}) async {
    if (useApi == true) {
      return getCrudClientWithApiKey(useApi: useApi);
    }
    String? accessToken = await authProvider.getAccessToken();
    // log.d('GraphQLClientService.getAmplifyClient.accessToken=$accessToken');

    // accessToken = null;

    Map<String, String> headers;
    if (accessToken != null) {
      headers = {
        'Authorization': accessToken,
        'host': Uri.parse(amplifyApiUrl).host,
      };
    } else {
      headers = {
        'x-api-key': amplifyApiKey,
        'host': Uri.parse(amplifyApiUrl).host,
      };
    }
    // log.d('GraphQLClientService.headers=$headers');
    final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

    final httpLink = Link.from([
      DioLink(
        amplifyApiUrl,
        client: _dio,
        defaultHeaders: headers,
      ),
    ]);

    // final HttpLink _httpLink = HttpLink(
    //   amplifyApiUrl,
    //   defaultHeaders: headers,
    // );

    final AuthLink authLink = AuthLink(
      getToken: () =>
          accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link link = authLink.concat(httpLink);
    String graphqlWsApiUrl = amplifyApiUrl
        .replaceFirst('https:', 'wss:')
        .replaceFirst('appsync-api', 'appsync-realtime-api');
    // log.d('GraphQLClientService.websocket=$graphqlWsApiUrl');

    final wsLink =
        WebSocketLink('$graphqlWsApiUrl?header=$encodedHeader&payload=e30=',
            config: SocketClientConfig(
              initialPayload: headers,
              serializer: AppSyncRequest(authHeader: headers),
              autoReconnect: true,
              delayBetweenReconnectionAttempts:
                  Duration(seconds: 5), // Default 5
              inactivityTimeout: Duration(minutes: 30), // Default 30 seconds
              queryAndMutationTimeout: Duration(seconds: 30), // Default 10
            ));

    link = Link.split((request) => request.isSubscription, wsLink, link);

    ValueNotifier<GraphQLClient> amplifyClient = ValueNotifier(
      GraphQLClient(
        cache: GraphQLCache(),
        link: link,
      ),
    );

    return amplifyClient;
  }

  Future<ValueNotifier<GraphQLClient>> getCrudClientWithApiKey(
      {bool useApi = false}) async {
    log.d('GraphQLClientService.getCrudClientWithApiKey().useApi=$useApi');
    String? accessToken = useApi ? null : await authProvider.getAccessToken();
    // log.d('GraphQLClientService.getGraphQLClient.accessToken=$accessToken');

    // accessToken = null;

    Map<String, String> headers;
    if (accessToken != null) {
      headers = {
        'Authorization': accessToken,
        'host': Uri.parse(amplifyApiUrl).host,
      };
    } else {
      headers = {
        'x-api-key': amplifyApiKey,
        'host': Uri.parse(amplifyApiUrl).host,
      };
    }

    final httpLink = Link.from([
      DioLink(
        amplifyApiUrl,
        client: _dio,
        defaultHeaders: headers,
      ),
    ]);

    log.d('GraphQLClientService.getCrudClientWithApiKey().headers=$headers');

    // final AuthLink authLink = AuthLink(
    //   getToken: () => accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    // );

    // final Link _link = _httpLink;
    // Link link = authLink.concat(httpLink);
    ValueNotifier<GraphQLClient> graphqlClient = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: httpLink,
    ));

    return graphqlClient;
  }
}
