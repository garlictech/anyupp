import '/core/core.dart';

class CommonException extends AppException {
  CommonException({
    required String code,
    required String message,
    required String subCode,
  }) : super(
          code: code,
          message: message,
          subCode: subCode,
        );
}
