import 'package:fa_prev/models.dart';
import 'dart:async';

import 'package:fa_prev/modules/orders/orders.dart';

class OrderRepository {
  final IOrdersProvider _provider;

  OrderRepository(this._provider);

  Future<Cart> getCurrentCart(String unitId) async {
    return _provider.getCurrentCart(unitId);
  }

  Stream<Cart> getCurrentCartStream(String unitId) {
    return _provider.getCurrentCartStream(unitId);
  }

  Future<void> updateCart(String unitId, Cart cart) async {
    return _provider.updateCart(unitId, cart);
  }

  Future<void> clearCart() async {
    return _provider.clearCart();
  }

  Stream<List<Order>> getCurrentOrders(String unitId) {
    return _provider.getCurrentOrders(unitId);
  }

  Stream<List<Order>> getOrderHistory(String unitId) {
    return _provider.getOrderHistory(unitId);
  }

  Future<void> createAndSendOrderFromCart() async {
    await _provider.createAndSendOrderFromCart();
  }

  Future<void> userPaymentIntentionSignal(String unitId) async {
    await _provider.userPaymentIntentionSignal(unitId);
  }

  Future<void> startOrderListSubscription(String unitId) async {
    await _provider.startOrderListSubscription(unitId);
  }

  Future<void> stopOrderListSubscription() async {
    await _provider.stopOrderListSubscription();
  }

  Future<void> startOrderHistoryListSubscription(String unitId) async {
    await _provider.startOrderHistoryListSubscription(unitId);
  }

  Future<void> stopOrderHistoryListSubscription() async {
    await _provider.stopOrderHistoryListSubscription();
  }

  Future<Order> getOrder(String orderId) async {
    return _provider.getOrder(orderId);
  }

  Cart get cart => _provider.cart;
}
