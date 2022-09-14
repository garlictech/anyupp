import '/core/core.dart';
import 'package:flutter/services.dart';

class TransactionException extends AppException {
  static const CODE = 'TRANSACTION_EXCEPTION';

  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  TransactionException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory TransactionException.fromPlatformException(PlatformException pe) {
    return TransactionException(
      code: TransactionException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory TransactionException.fromException(String code, Exception e) {
    return TransactionException(
        code: TransactionException.CODE, subCode: code, message: e.toString(), details: e.runtimeType);
  }
}
