import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';

class SignUpException extends AppException {

  static const CODE = 'SIGN_UP_EXCEPTION';

  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  static const INVALID_PASSWORD = 'INVALID_PASSWORD';

  SignUpException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory SignUpException.fromPlatformException(PlatformException pe) {
    return SignUpException(
      code: SignUpException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory SignUpException.fromException(String code, Exception e) {
    return SignUpException(code: SignUpException.CODE, subCode: code, message: e.toString(), details: e.runtimeType);
  }

  @override
  String toString() {
    return 'SingUpException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
