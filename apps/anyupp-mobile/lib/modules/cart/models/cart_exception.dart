import '/core/core.dart';
import 'package:flutter/services.dart';

class CartException extends AppException {
  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  CartException({message, details, code}) : super(code: code, message: message, details: details);

  factory CartException.fromPlatformException(PlatformException pe) {
    return CartException(code: pe.code, message: pe.message, details: pe.details);
  }

  factory CartException.fromException(String code, Exception e) {
    return CartException(code: code, message: e.toString(), details: e.runtimeType);
  }
}
