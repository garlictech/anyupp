import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLException extends AppException {
  static const CODE = 'GRAPHQL_EXCEPTION';

  static const CRUDE_CODE = "CRUD_CLIENT_EXCEPTION";

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

  factory GraphQLException.fromApolloException(OperationException oe) {
    return GraphQLException(
      code: GraphQLException.CODE,
      subCode: oe.graphqlErrors[0].extensions['code'],
      message: oe.graphqlErrors[0].message,
      details: oe.toString(),
    );
  }

  factory GraphQLException.fromException(String code, Exception e) {
    return GraphQLException(
        code: GraphQLException.CODE,
        subCode: code,
        message: e.toString(),
        details: e.runtimeType);
  }

  factory GraphQLException.fromCrudException(Exception e){
    return GraphQLException(
        code: CODE,
        subCode: GraphQLException.CRUDE_CODE,
        message: e.toString(),
        details: e.runtimeType);
  }

  @override
  String toString() {
    return 'GraphQLException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
