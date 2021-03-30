import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';

class GraphQLException extends AppException {

  static const CODE = 'GRAPHQL_EXCEPTION';

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

  factory GraphQLException.fromException(String code, Exception e) {
    return GraphQLException(code: GraphQLException.CODE, subCode: code, message: e.toString(), details: e.runtimeType);
  }

  @override
  String toString() {
    return 'GraphQLException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
