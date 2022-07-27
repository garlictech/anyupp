import '/core/core.dart';
import 'package:flutter/services.dart';

class ProductException extends AppException {
  static const CODE = 'PRODUCT_EXCEPTION';

  static const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  static const ERROR_LOADING_PRODUCTS = 'ERROR_LOADING_PRODUCTS';

  static const ERROR_LOADING_PRODUCT_CATEGORIES = 'ERROR_LOADING_PRODUCT_CATEGORIES';

  ProductException({
    code,
    subCode,
    message,
    details,
  }) : super(code: code, subCode: subCode, message: message, details: details);

  factory ProductException.fromPlatformException(PlatformException pe) {
    return ProductException(
      code: ProductException.CODE,
      subCode: AppException.peCode(pe),
      message: AppException.peMessage(pe),
      details: AppException.peDetails(pe),
    );
  }

  factory ProductException.fromException(String code, Exception e) {
    return ProductException(code: ProductException.CODE, subCode: code, message: e.toString(), details: e.runtimeType);
  }

  @override
  String toString() {
    return 'ProductException[code=$code, subCode=$subCode, message=$message, details=$details]';
  }
}
