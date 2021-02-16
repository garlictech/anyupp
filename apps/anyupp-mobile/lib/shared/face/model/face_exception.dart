import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';

class FaceException extends AppException {
  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
  static const FACE_DETECTION_ALREADY_RUNNING = 'FACE_DETECTION_ALREADY_RUNNING';

  FaceException({
    code,
    message,
    details,
  }) : super(code: code, message: message, details: details);

  factory FaceException.fromPlatformException(PlatformException pe) {
    return FaceException(code: pe.code, message: pe.message, details: pe.details);
  }

  factory FaceException.fromException(String code, Exception e) {
    return FaceException(code: code, message: e.toString(), details: e.runtimeType);
  }
}
