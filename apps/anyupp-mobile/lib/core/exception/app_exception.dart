import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

abstract class AppException implements Exception {
  /// An error code.
  final String code;

  /// From the Backend there is even a subCode.
  final String subCode;

  /// A human-readable error message (possibly null).
  final String message;

  /// Error details. It could contain translation keys (possibly null).
  final dynamic details;

  AppException({
    @required this.code,
    this.message,
    this.details,
    this.subCode,
  }) : assert(code != null);

  @override
  String toString() => 'AppException(code=$code, message=$message, details=$details)';

  static String peCode(PlatformException pe) {
    return pe.details != null && pe.details['details'] != null
        ? pe.details['details']['code']
        : pe.details != null && pe.details['code'] ? pe.details['code'] : pe.code;
  }

  static String peSubCode(PlatformException pe) {
    return pe.details != null && pe.details['details'] != null ? pe.details['details']['subCode'] : null;
  }

  static String peDetails(PlatformException pe) {
    return pe.details != null && pe.details['details'] != null ? pe.details['details'] : pe.details;
  }

  static String peMessage(PlatformException pe) {
    return pe.details != null && pe.details['message'] != null ? pe.details['message'] : pe.message;
  }
}
