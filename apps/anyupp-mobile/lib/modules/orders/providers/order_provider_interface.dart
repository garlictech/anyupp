import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';

abstract class IOrdersProvider {
  Future<Cart> getCurrentCart(String chainId, String unitId);

  Stream<Cart> getCurrentCartStream(String chainId, String unitId);

  Future<void> updateCart(String chainId, String unitId, Cart cart);

  Future<void> clearCart(String chainId, String unitId);

  Stream<List<Order>> getCurrentOrders(String chainId, String unitId);

  Stream<List<Order>> getOrderHistory(String chainId, String unitId);

  Future<String> createAndSendOrderFromCart();

  Future<void> userPaymentIntentionSignal(String chainId, String unitId);

  Future<void> startOrderListSubscription(String chainId, String unitId);

  Future<void> stopOrderListSubscription();

  Future<void> startOrderHistoryListSubscription(String chainId, String unitId);

  Future<void> stopOrderHistoryListSubscription();

  Future<bool> addInvoiceInfo(InvoiceInfo invioceInfo);

  Future<Order> getOrder(String orderId);

  Cart get cart;
}
