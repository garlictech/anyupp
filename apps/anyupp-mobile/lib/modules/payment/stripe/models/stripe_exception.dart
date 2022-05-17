import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';

class StripeException extends AppException {
  static const CODE = 'STRIPE_EXCEPTION';
  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
  static const CARD_DELETE_ERROR = 'CARD_DELETE_ERROR';
  static const CARD_CREATE_ERROR = 'CARD_CREATE_ERROR';

  StripeException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory StripeException.fromPlatformException(PlatformException pe) {
    return StripeException(
      code: StripeException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory StripeException.fromException(String code, Exception e) {
    return StripeException(
        code: StripeException.CODE,
        subCode: code,
        message: e.toString(),
        details: e.runtimeType);
  }
}
