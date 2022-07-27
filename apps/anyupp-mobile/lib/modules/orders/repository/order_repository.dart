import '/models.dart';
import 'dart:async';

import '/modules/orders/orders.dart';

class OrderRepository implements IOrdersProvider {
  final IOrdersProvider _provider;

  OrderRepository(this._provider);

  // Stream<List<Order>> getCurrentOrders(String unitId) {
  //   return _provider.getCurrentOrders(unitId);
  // }

  // Stream<List<Order>> getOrderHistory(String unitId) {
  //   return _provider.getOrderHistory(unitId);
  // }

  Future<void> userPaymentIntentionSignal(String unitId) async {
    await _provider.userPaymentIntentionSignal(unitId);
  }

  Future<void> stopOrderListSubscription() async {
    await _provider.stopOrderListSubscription();
  }

  Future<void> startOrderHistoryListSubscription(
      StreamController<List<Order>?> controller) async {
    await _provider.startOrderHistoryListSubscription(controller);
  }

  Future<void> stopOrderHistoryListSubscription() async {
    await _provider.stopOrderHistoryListSubscription();
  }

  Future<Order?> getOrder(String orderId) async {
    return _provider.getOrder(orderId);
  }

  @override
  Future<void> addInvoiceInfo(InvoiceInfo invioceInfo) {
    return _provider.addInvoiceInfo(invioceInfo);
  }

  // @override
  // Future<Cart> setPaymentMode(String unitId, PaymentMode mode) {
  //   return _provider.setPaymentMode(unitId, mode);
  // }

  @override
  bool get orderListHasMoreItems => _provider.orderListHasMoreItems;

  @override
  int get orderListTotalCount => _provider.orderListTotalCount;

  @override
  bool get orderHistoryListHasMoreItems =>
      _provider.orderHistoryListHasMoreItems;

  @override
  int get orderHistoryListTotalCount => _provider.orderHistoryListTotalCount;

  @override
  String? get orderHistoryListNextToken => _provider.orderHistoryListNextToken;

  @override
  String? get orderListNextToken => _provider.orderListNextToken;

  @override
  Future<List<Order>?> loadOrderHistoryNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  }) {
    return _provider.loadOrderHistoryNextPage(
      controller: controller,
      nextToken: nextToken,
    );
  }

  @override
  Future<List<Order>?> loadOrdersNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  }) {
    return _provider.loadOrdersNextPage(
      controller: controller,
      nextToken: nextToken,
    );
  }

  @override
  Future<void> startOrderListSubscription(
      StreamController<List<Order>?> controller) {
    return _provider.startOrderListSubscription(controller);
  }

  @override
  Future<int> getActiveOrderCount(String unitId) {
    return _provider.getActiveOrderCount(unitId);
  }
}
