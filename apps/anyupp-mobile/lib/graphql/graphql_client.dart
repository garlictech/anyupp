import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_request_serializer.dart';

ValueNotifier<GraphQLClient> getGraphQLClient({
  @required String url,
  @required String apiKey,
  String websocketUrl,
}) {
  print('Initializing GraphQL Client. URL=$url, wsURL=$websocketUrl, key=$apiKey');
  final Map<String, String> headers = {
    "x-api-key": apiKey,
    "host": Uri.parse(url).host,
  };
  final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

  final HttpLink _httpLink = HttpLink(url, defaultHeaders: headers);

  final AuthLink _authLink = AuthLink(
    getToken: () => 'x-api-key: $apiKey',
  );

  // final Link _link = _httpLink;
  Link _link = _authLink.concat(_httpLink);


  final _wsLink = WebSocketLink('$websocketUrl?header=$encodedHeader&payload=e30=',
      config: SocketClientConfig(
        serializer: AppSyncRequest(authHeader: headers),
        autoReconnect: true,
        delayBetweenReconnectionAttempts: Duration(seconds: 1), // Default 5
        inactivityTimeout: Duration(minutes: 30), // Default 30 seconds
        queryAndMutationTimeout: Duration(seconds: 30), // Default 10
      ));

  _link = Link.split((request) => request.isSubscription, _wsLink, _link);

  return  ValueNotifier(GraphQLClient(
    cache: GraphQLCache(),
    link: _link,
  ));
}
