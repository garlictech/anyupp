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

  // --- ORDERS
  Future<void> startOrderListSubscription(String unitId);

  Future<void> stopOrderListSubscription();

  Future<List<Order>> loadOrdersNextPage(String unitId, String nextToken);

  bool get orderListHasMoreItems;

  int get orderListTotalCount;

  String get orderListNextToken;

  // --- ORDER HISTORY
  Future<void> startOrderHistoryListSubscription(String unitId);

  Future<void> stopOrderHistoryListSubscription();

  Future<List<Order>> loadOrderHistoryNextPage(String unitId, String nextToken);

  bool get orderHistoryListHasMoreItems;

  int get orderHistoryListTotalCount;

  String get orderHistoryListNextToken;

  Future<void> addInvoiceInfo(InvoiceInfo invioceInfo);

  Future<Order> getOrder(String orderId);

  Future<Cart> setPaymentMode(String unitId, PaymentMode mode);

  Cart get cart;
}
