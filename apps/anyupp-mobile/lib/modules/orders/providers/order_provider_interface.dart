import 'dart:async';

import 'package:fa_prev/models.dart';

abstract class IOrdersProvider {
  Future<void> userPaymentIntentionSignal(String unitId);

  // --- ORDERS
  // StreamController<List<Order>> get orderStreamController;

  // Stream<List<Order>> getCurrentOrders(String unitId);

  Future<void> startOrderListSubscription(
      StreamController<List<Order>?> controller);

  Future<void> stopOrderListSubscription();

  Future<List<Order>?> loadOrdersNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  });

  bool get orderListHasMoreItems;

  int get orderListTotalCount;

  String? get orderListNextToken;

  // --- ORDER HISTORY
  // Stream<List<Order>> getOrderHistory(String unitId);

  Future<void> startOrderHistoryListSubscription(
      StreamController<List<Order>?> controller);

  Future<void> stopOrderHistoryListSubscription();

  Future<List<Order>?> loadOrderHistoryNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  });

  bool get orderHistoryListHasMoreItems;

  int get orderHistoryListTotalCount;

  String? get orderHistoryListNextToken;

  Future<void> addInvoiceInfo(InvoiceInfo invioceInfo);

  Future<Order?> getOrder(String orderId);

  Future<int> getActiveOrderCount(String unitId);
}
