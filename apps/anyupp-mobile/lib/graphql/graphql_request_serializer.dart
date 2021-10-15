import 'dart:convert';

import 'package:graphql_flutter/graphql_flutter.dart';
import "package:gql/language.dart" show printNode;

class AppSyncRequest extends RequestSerializer {
  final Map<String, dynamic> authHeader;

  const AppSyncRequest({
    required this.authHeader,
  });

  @override
  Map<String, dynamic> serializeRequest(Request request) => {
        "data": jsonEncode({
          "query": printNode(request.operation.document),
          "variables": request.variables,
        }),
        "extensions": {
          "authorization": this.authHeader,
        }
      };
}
