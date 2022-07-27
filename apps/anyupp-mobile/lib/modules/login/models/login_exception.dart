import '/core/core.dart';
import 'package:flutter/services.dart';

class LoginException extends AppException {
  static const CODE = 'LOGIN_EXCEPTION';

  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  static const LOGIN_CANCELLED_BY_USER = 'LOGIN_CANCELLED_BY_USER';

  static const NEED_ACCOUNT_LINKING = 'NEED_ACCOUNT_LINKING';

  static const FACEBOOK_LOGIN_ERROR = 'FACEBOOK_LOGIN_ERROR';

  static const GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR';

  static const APPLE_LOGIN_ERROR = 'APPLE_LOGIN_ERROR';

  static const APPLE_LOGIN_NO_CREDENTIAL = 'APPLE_LOGIN_NO_CREDENTIAL';

  static const ERROR_LOGIN_INVALID_PROVIDER = 'ERROR_LOGIN_INVALID_PROVIDER';

  static const ERROR_ACCOUNT_LINK_EMAIL_NOT_MATCH = 'ERROR_ACCOUNT_LINK_EMAIL_NOT_MATCH';

  static const ERROR_ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL = 'ERROR_ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL';

  static const ERROR_ACCOUNT_UNLINK = 'ERROR_ACCOUNT_UNLINK';

  static const LOGIN_PHONE_SMS_TIMEOUT = 'LOGIN_PHONE_SMS_TIMEOUT';

  static const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';

  static const INVALID_PASSWORD = 'INVALID_PASSWORD';

  static const ERROR_PASSWORD_MISMATCH = 'INVALID_PASSWORD';

  static const UNCONFIRMED = 'UNCONFIRMED';

  static const INVALID_ANONYMUS_USER = 'INVALID_ANONYMUS_USER';

  static const USER_NOT_LOGGED_IN = 'USER_NOT_LOGGED_IN';

  static const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';

  LoginException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory LoginException.fromPlatformException(PlatformException pe) {
    return LoginException(
      code: LoginException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory LoginException.fromException(String code, Exception e) {
    return LoginException(code: LoginException.CODE, subCode: code, message: e.toString(), details: e.runtimeType);
  }

  @override
  String toString() {
    return 'LoginException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
