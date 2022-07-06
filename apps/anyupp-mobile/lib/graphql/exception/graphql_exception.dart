import 'dart:convert';

import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLException extends AppException {
  static const CODE = 'GRAPHQL_EXCEPTION';

  static const CRUD_CODE = "CRUD_CLIENT_EXCEPTION";

  static const ANYUPP_CODE = "ANYUPP_CLIENT_EXCEPTION";

  static const CODE_MUTATION_EXCEPTION = 'GRAPHQL_MUTATION_EXCEPTION';

  static const CODE_QUERY_EXCEPTION = 'GRAPHQL_QUERY_EXCEPTION';

  GraphQLException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory GraphQLException.fromPlatformException(PlatformException pe) {
    return GraphQLException(
      code: GraphQLException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory GraphQLException.fromOperationException(
      String code, OperationException oe) {
    GraphQLError graphQLError = oe.graphqlErrors.first;
    String message = graphQLError.message.toString();
    String subCode;
    Map<String, dynamic> decodedMessage;
    try {
      decodedMessage = json.decode(message.trim());
      subCode = decodedMessage["code"];
      message = decodedMessage["message"];
    } on FormatException {
      subCode = code;
    }
    return GraphQLException(
      code: GraphQLException.CODE,
      subCode: subCode,
      message: message,
      details: oe.runtimeType,
    );
  }

  factory GraphQLException.fromException(String code, Exception e) {
    return GraphQLException(
      code: GraphQLException.CODE,
      subCode: code,
      message: e.toString(),
      details: e.runtimeType,
    );
  }

  factory GraphQLException.fromCrudException(Exception e) {
    return GraphQLException(
        code: GraphQLException.CODE,
        subCode: GraphQLException.CRUD_CODE,
        message: e.toString(),
        details: e.runtimeType);
  }

  factory GraphQLException.fromGraphQLError(
      String code, List<GraphQLError>? errors) {
    return GraphQLException(
      code: GraphQLException.CODE,
      subCode: code,
      message: errors?[0].message,
      details: errors?[0].locations.toString(),
    );
  }

  @override
  String toString() {
    return 'GraphQLException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
