import 'dart:convert';

import 'package:fa_prev/shared/auth/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_request_serializer.dart';

class GraphQLClientService {
  final String amplifyApiUrl;
  final String amplifyApiKey;
  final String graphqlApiUrl;
  final String graphqlApiKey;
  final IAuthProvider _authProvider;

  ValueNotifier<GraphQLClient> _amplifyClient;
  ValueNotifier<GraphQLClient> _graphqlClient;

  GraphQLClientService({
    @required IAuthProvider authProvider,
    @required this.amplifyApiUrl,
    @required this.amplifyApiKey,
    @required this.graphqlApiUrl,
    @required this.graphqlApiKey,
  }) : _authProvider = authProvider;

  Future<ValueNotifier<GraphQLClient>> getAmplifyClient({bool force = false}) async {
    if (force == true) {
      await _amplifyClient?.dispose();
      _amplifyClient = null;
    }

    if (_amplifyClient != null) {
      return _amplifyClient;
    }

    String accessToken = await _authProvider.getAccessToken();
    print('GraphQLClientService.Creating client. AccessToken=$accessToken');
    // TODO API key auth van most, HA lesz cognito, akkor torolni ezt a sort:
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
    // print('GraphQLClientService.headers=$headers');
    final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

    final HttpLink _httpLink = HttpLink(
      amplifyApiUrl,
      defaultHeaders: headers,
    );

    final AuthLink _authLink = AuthLink(
      getToken: () => accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link _link = _authLink.concat(_httpLink);
    String graphqlWsApiUrl =
        amplifyApiUrl.replaceFirst('https:', 'wss:').replaceFirst('appsync-api', 'appsync-realtime-api');
    print('GraphQLClientService.websocket=$graphqlWsApiUrl');

    final _wsLink = WebSocketLink('$graphqlWsApiUrl?header=$encodedHeader&payload=e30=',
        config: SocketClientConfig(
          initialPayload: headers,
          serializer: AppSyncRequest(authHeader: headers),
          autoReconnect: true,
          delayBetweenReconnectionAttempts: Duration(seconds: 5), // Default 5
          inactivityTimeout: Duration(minutes: 30), // Default 30 seconds
          queryAndMutationTimeout: Duration(seconds: 30), // Default 10
        ));

    _link = Link.split((request) => request.isSubscription, _wsLink, _link);

    _amplifyClient = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: _link,
    ));

    return _amplifyClient;
  }

  Future<ValueNotifier<GraphQLClient>> getGraphQLClient() async {
    print('getAdminGraphQLClient().url=$graphqlApiUrl');
    if (_graphqlClient != null) {
      return _graphqlClient;
    }

    _graphqlClient?.dispose();

    String accessToken = await _authProvider.getAccessToken();
    print('getAdminGraphQLClient().accessToken=$accessToken');
    // TODO API key auth van most, HA lesz cognito, akkor torolni ezt a sort:
    // accessToken = null;

    Map<String, String> headers;
    if (accessToken != null) {
      headers = {
        'Authorization': accessToken,
        'host': Uri.parse(graphqlApiUrl).host,
      };
    } else {
      headers = {
        'x-api-key': graphqlApiKey,
        'host': Uri.parse(graphqlApiUrl).host,
      };
    }

    final HttpLink _httpLink = HttpLink(
      amplifyApiUrl,
      defaultHeaders: headers,
    );

    final AuthLink _authLink = AuthLink(
      getToken: () => accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link _link = _authLink.concat(_httpLink);

    _graphqlClient = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: _link,
    ));

    return _graphqlClient;
  }
}
