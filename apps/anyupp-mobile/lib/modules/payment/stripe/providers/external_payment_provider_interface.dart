import 'package:fa_prev/models.dart';

abstract class IExternalPaymentProvider {
  Future<void> startExternalPayment(Cart cart, String orderMethod);
  Future<void> startOrderExternalPayment(String orderId, String orderMethod);
}
