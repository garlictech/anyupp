import 'dart:convert';
import 'package:fa_prev/models.dart';

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
  print('createStartPaymentRequestVariables().map=${jsonEncode(map)}');
  return map;
}
