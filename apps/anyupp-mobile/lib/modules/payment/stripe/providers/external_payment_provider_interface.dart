import 'package:fa_prev/graphql/generated/anyupp-api.dart' show UserInvoiceAddress;
import 'package:fa_prev/models.dart';

abstract class IExternalPaymentProvider {
  /// Start external payment with order creation
  Future<void> startExternalPayment(
    Cart cart,
    PaymentMode paymentMode,
    UserInvoiceAddress? invoiceAddress,
  );

  /// Start external payment on existing order
  Future<void> startOrderExternalPayment(
    String orderId,
    PaymentMode paymentMode,
    UserInvoiceAddress? invoiceAddress,
  );
}
