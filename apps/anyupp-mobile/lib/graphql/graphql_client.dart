import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

GraphQLClient getGraphQLClient({@required String url}) {
  final HttpLink _httpLink = HttpLink(
    uri: url,
  );

  final Link _link = _httpLink;

  return GraphQLClient(
      cache: InMemoryCache(),
      link: _link,
  );
}
