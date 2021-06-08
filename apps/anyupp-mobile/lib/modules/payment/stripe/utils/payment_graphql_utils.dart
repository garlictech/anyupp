import 'dart:convert';

import 'package:fa_prev/models.dart';

Map<String, dynamic> createStartPaymentRequestVariables({
  String orderId,
  String paymentMethod,
  String paymentMethodId,
  bool saveCard,
  UserInvoiceAddress invoiceAddress,
}) {
  Map<String, dynamic>  map = {
    'orderId': orderId,
    'paymentMethod': 'inapp',
    'paymentMethodId': paymentMethodId,
    'savePaymentMethod': saveCard,
    'invoiceAddress': invoiceAddress.toMap(),
  };
  print('createStartPaymentRequestVariables().map=${jsonEncode(map)}');
  return map;
}
