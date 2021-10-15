import 'package:fa_prev/graphql/generated/anyupp-api.dart';
import 'package:fa_prev/models.dart';

abstract class IExternalPaymentProvider {
  Future<void> startExternalPayment(Cart cart, PaymentMode paymentMode, UserInvoiceAddress? invoiceAddress);
  Future<void> startOrderExternalPayment(String orderId, PaymentMode paymentMode, UserInvoiceAddress? invoiceAddress);
}
