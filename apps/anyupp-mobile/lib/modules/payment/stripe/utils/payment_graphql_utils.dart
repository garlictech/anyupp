import 'dart:convert';

import '/core/core.dart';
import '/models.dart';

Map<String, dynamic> createStartPaymentRequestVariables({
  String? orderId,
  String? paymentMethod,
  String? paymentMethodId,
  bool? saveCard,
  UserInvoiceAddress? invoiceAddress,
}) {
  Map<String, dynamic> map = {
    'orderId': orderId,
    'paymentMethod': paymentMethod,
    'paymentMethodId': paymentMethodId,
    'savePaymentMethod': saveCard,
    'invoiceAddress': invoiceAddress?.toJson(),
  };
  log.d('createStartPaymentRequestVariables().map=${jsonEncode(map)}');
  return map;
}
