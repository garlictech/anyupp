import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';

class SimplePayException extends AppException {
  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  static const ERROR_SIMPLE_PAY_TRANSACTION_STATUS_UNKNOWN = 'ERROR_SIMPLE_PAY_TRANSACTION_STATUS_UNKNOWN';

  SimplePayException({
    code,
    message,
    details,
  }) : super(code: code, message: message, details: details);

  factory SimplePayException.fromPlatformException(PlatformException pe) {
    return SimplePayException(
      code: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }
}
