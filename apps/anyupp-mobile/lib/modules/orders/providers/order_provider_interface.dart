import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';

abstract class IOrdersProvider {
  Future<Cart> getCurrentCart(String unitId);

  Stream<Cart> getCurrentCartStream(String unitId);

  Future<void> updateCart(String unitId, Cart cart);

  Future<void> clearCart();

  Stream<List<Order>> getCurrentOrders(String unitId);

  Stream<List<Order>> getOrderHistory(String unitId);

  Future<String> createAndSendOrderFromCart();

  Future<void> userPaymentIntentionSignal(String unitId);

  Future<void> startOrderListSubscription(String unitId);

  Future<void> stopOrderListSubscription();

  Future<void> startOrderHistoryListSubscription(String unitId);

  Future<void> stopOrderHistoryListSubscription();

  Future<bool> addInvoiceInfo(InvoiceInfo invioceInfo);

  Future<Order> getOrder(String orderId);

  Future<Cart> setPaymentMode(String unitId, PaymentMode mode);

  Cart get cart;
}
