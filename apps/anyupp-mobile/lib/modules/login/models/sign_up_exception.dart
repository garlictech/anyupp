import '/core/core.dart';
import 'package:flutter/services.dart';

class SignUpException extends AppException {
  static const CODE = 'SIGN_UP_EXCEPTION';

  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  static const INVALID_PASSWORD = 'INVALID_PASSWORD';

  static const INVALID_CONFIRMATION_CODE = 'INVALID_CONFIRMATION_CODE';

  static const USER_EXISTS = 'USER_ALREADY_EXISTS';

  static const NOT_EMAIL_OR_PHONE = 'NOT_EMAIL_OR_PHONE';

  static const USER_EMAIL_NOT_SAME = 'USER_EMAIL_NOT_SAME';

  static const ERROR_PASSWORD_MISSMATCH = 'ERROR_PASSWORD_MISSMATCH';

  static const LIMIT_ECXEEDED = 'LIMIT_EXCEEDED';

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

  factory SignUpException.fromException(String code, String message, Exception e) {
    return SignUpException(code: SignUpException.CODE, subCode: code, message: message, details: e.runtimeType);
  }

  @override
  String toString() {
    return 'SingUpException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
