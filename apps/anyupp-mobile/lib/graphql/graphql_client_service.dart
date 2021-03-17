import 'dart:convert';

import 'package:fa_prev/shared/auth/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_request_serializer.dart';

class GraphQLClientService {
  final String apiUrl;
  final String apiKey;
  final String websocketApiUrl;
  final IAuthProvider _authProvider;

  ValueNotifier<GraphQLClient> _client;

  GraphQLClientService({@required IAuthProvider authProvider, @required this.apiUrl, @required this.apiKey, @required this.websocketApiUrl})
      : _authProvider = authProvider;

  Future<ValueNotifier<GraphQLClient>> getGraphQLClient() async {

    if (_client != null) {
      return _client;
    }

    _client?.dispose();

    String accessToken = await _authProvider.getAccessToken();
    print('GraphQLClientService.Creating client. key=$apiKey, accessToken=$accessToken');

    final Map<String, String> headers = {
      'x-api-key': apiKey,
      'host': Uri.parse(apiUrl).host,
    };
    if (accessToken != null) {
      headers['Authorization'] = 'Bearer $accessToken';
    }
    final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

    final HttpLink _httpLink = HttpLink(apiUrl, defaultHeaders: headers);

    final AuthLink _authLink = AuthLink(
      // getToken: () => 'x-api-key: $apiKey',
      getToken: () => accessToken != null ? 'Bearer $accessToken' : null,
    );

    // final Link _link = _httpLink;
    Link _link = _authLink.concat(_httpLink);

    final _wsLink = WebSocketLink('$websocketApiUrl?header=$encodedHeader&payload=e30=',
        config: SocketClientConfig(
          serializer: AppSyncRequest(authHeader: headers),
          autoReconnect: true,
          delayBetweenReconnectionAttempts: Duration(seconds: 1), // Default 5
          inactivityTimeout: Duration(minutes: 30), // Default 30 seconds
          queryAndMutationTimeout: Duration(seconds: 30), // Default 10
        ));

    _link = Link.split((request) => request.isSubscription, _wsLink, _link);

    _client = ValueNotifier(GraphQLClient(
      cache: GraphQLCache(),
      link: _link,
    ));

    return _client;
  }

}
