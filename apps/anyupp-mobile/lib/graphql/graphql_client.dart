import 'dart:convert';

import 'package:fa_prev/graphql/websocket_link_w_headers.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'graphql_request_serializer.dart';

ValueNotifier<GraphQLClient> getGraphQLClient({
  @required String url,
  @required String apiKey,
  String websocketUrl,
}) {
  print('Initializing GraphQL Client. URL=$url, wsURL=$websocketUrl, key=$apiKey');
  final HttpLink _httpLink = HttpLink(url);

  final AuthLink _authLink = AuthLink(
    getToken: () => 'x-api-key: $apiKey',
  );

  // final Link _link = _httpLink;
  Link _link = _authLink.concat(_httpLink);

  final Map<String, dynamic> headers = {
    "x-api-key": apiKey,
    "host": Uri.parse(url).host,
  };
  print('**** GraphQL Client.headers=$headers');
  final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));

  // WSLink _wsLink = WSLink(
  //   '$websocketUrl?header=$encodedHeader&payload=e30=',
  //       config: SocketClientConfig(
  //         // serializer: AppSyncRequest(authHeader: headers),
  //         autoReconnect: true,
  //         delayBetweenReconnectionAttempts: Duration(seconds: 5), // Default
  //         inactivityTimeout: Duration(seconds: 30), // Default
  //         queryAndMutationTimeout: Duration(seconds: 10), // Default
  //       ),
  //       headers: headers,
  // );
  final _wsLink = WebSocketLink('$websocketUrl?header=$encodedHeader&payload=e30=',
      config: SocketClientConfig(
        serializer: AppSyncRequest(authHeader: headers),
        autoReconnect: true,
        delayBetweenReconnectionAttempts: Duration(seconds: 1), // Default
        inactivityTimeout: Duration(seconds: 30), // Default
        queryAndMutationTimeout: Duration(seconds: 30), // Default
      ));
  print('**** GraphQL Client.wslink=$_wsLink');

  _link = Link.split((request) => request.isSubscription, _wsLink, _link);
  print('**** GraphQL Client.final_link=$_link');

  // final encodedHeader = base64.encode(utf8.encode(jsonEncode(headers)));
  // /// subscriptions must be split otherwise `HttpLink` will. swallow them
  // if (websocketUrl != null) {
  //   final _wsLink = WebSocketLink(
  //       '$websocketUrl?header=$encodedHeader&payload=e30=',
  //       config: SocketClientConfig(
  //         serializer: AppSyncRequest(authHeader: headers),
  //         autoReconnect: true,
  //         delayBetweenReconnectionAttempts: Duration(seconds: 5), // Default
  //         inactivityTimeout: Duration(seconds: 30), // Default
  //         queryAndMutationTimeout: Duration(seconds: 10), // Default
  //       ));
  //   _link = Link.split((request) => request.isSubscription, _wsLink, _link);
  // }

  return  ValueNotifier(GraphQLClient(
    cache: GraphQLCache(),
    link: _wsLink,
  ));
}
