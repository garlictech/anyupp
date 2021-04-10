import 'dart:convert';

import 'package:fa_prev/shared/auth/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLClientService {
  final String graphqlApiUrl;
  final String graphqlApiKey;
  final String graphqlAdminApiUrl;
  final String graphqlAdminApiKey;
  final IAuthProvider _authProvider;

  ValueNotifier<GraphQLClient> _appSyncClient;
  ValueNotifier<GraphQLClient> _adminClient;

  GraphQLClientService({
    @required IAuthProvider authProvider,
    @required this.graphqlApiUrl,
    @required this.graphqlApiKey,
    @required this.graphqlAdminApiUrl,
    @required this.graphqlAdminApiKey,
  }) : _authProvider = authProvider;

  Future<ValueNotifier<GraphQLClient>> getAppSyncGraphQLClient() async {
    if (_appSyncClient != null) {
      return _appSyncClient;
    }

    _appSyncClient?.dispose();

    String accessToken = await _authProvider.getAccessToken();
    // TODO API key auth van most, HA lesz cognito, akkor torolni ezt a sort:
    accessToken = null;
    // print('GraphQLClientService.Creating client. AccessToken=$accessToken');

    Map<String, String> headers;
    if (accessToken != null) {
      headers = {
        'Authorization': 'Bearer $accessToken',
        'host': Uri.parse(graphqlApiUrl).host,
      };
    } else {
      headers = {
        'x-api-key': graphqlApiKey,
        'host': Uri.parse(graphqlApiUrl).host,
      };
    }
    print('GraphQLClientService.headers=$headers');
    final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

    final HttpLink _httpLink = HttpLink(
      graphqlApiUrl,
      defaultHeaders: headers,
    );

    final AuthLink _authLink = AuthLink(
      getToken: () => accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link _link = _authLink.concat(_httpLink);
    String graphqlWsApiUrl =
        graphqlApiUrl.replaceFirst('https:', 'wss:').replaceFirst('appsync-api', 'appsync-realtime-api');
    print('GraphQLClientService.websocket=$graphqlWsApiUrl');

    final _wsLink = WebSocketLink('$graphqlWsApiUrl?header=$encodedHeader&payload=e30=',
        config: SocketClientConfig(
          initialPayload: headers,
          // serializer: AppSyncRequest(authHeader: headers),
          autoReconnect: true,
          delayBetweenReconnectionAttempts: Duration(seconds: 5), // Default 5
          inactivityTimeout: Duration(minutes: 30), // Default 30 seconds
          queryAndMutationTimeout: Duration(seconds: 30), // Default 10
        ));

    _link = Link.split((request) => request.isSubscription, _wsLink, _link);

    _appSyncClient = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: _link,
    ));

    return _appSyncClient;
  }

  Future<ValueNotifier<GraphQLClient>> getNormalGraphQLClient() async {
    if (_adminClient != null) {
      return _adminClient;
    }

    _adminClient?.dispose();

    String accessToken = await _authProvider.getAccessToken();
    // TODO API key auth van most, HA lesz cognito, akkor torolni ezt a sort:
    accessToken = null;

    Map<String, String> headers;
    if (accessToken != null) {
      headers = {
        'Authorization': 'Bearer $accessToken',
        'host': Uri.parse(graphqlAdminApiUrl).host,
      };
    } else {
      headers = {
        'x-api-key': graphqlAdminApiKey,
        'host': Uri.parse(graphqlAdminApiUrl).host,
      };
    }

    final HttpLink _httpLink = HttpLink(
      graphqlApiUrl,
      defaultHeaders: headers,
    );

    final AuthLink _authLink = AuthLink(
      getToken: () => accessToken, //accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link _link = _authLink.concat(_httpLink);

    _adminClient = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: _link,
    ));

    return _adminClient;
  }
}
