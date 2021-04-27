import 'package:fa_prev/models.dart';
import 'dart:async';

import 'package:fa_prev/modules/orders/orders.dart';

class OrderRepository {
  final IOrdersProvider _provider;

  OrderRepository(this._provider);

  Future<Cart> getCurrentCart(String chainId, String unitId) async {
    return _provider.getCurrentCart(chainId, unitId);
  }

  Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
    return _provider.getCurrentCartStream(chainId, unitId);
  }

  Future<void> updateCart(String chainId, String unitId, Cart cart) async {
    return _provider.updateCart(chainId, unitId, cart);
  }

  Future<void> clearCart(String chainId, String unitId) async {
    return _provider.clearCart(chainId, unitId);
  }

  Stream<List<Order>> getCurrentOrders(String chainId, String unitId) {
    return _provider.getCurrentOrders(chainId, unitId);
  }

  Stream<List<Order>> getOrderHistory(String chainId, String unitId) {
    return _provider.getOrderHistory(chainId, unitId);
  }

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
    await _provider.createAndSendOrderFromCart(unit, paymentMethod);
    // await _provider.getCurrentCart(unit.chainId, unit.id);
  }

  Future<void> userPaymentIntentionSignal(String chainId, String unitId) async {
    await _provider.userPaymentIntentionSignal(chainId, unitId);
  }

  Future<void> startOrderListSubscription(String chainId, String unitId) async {
    await _provider.startOrderListSubscription(chainId, unitId);
  }

  Future<void> stopOrderListSubscription() async {
    await _provider.stopOrderListSubscription();
  }

    Future<void> startOrderHistoryListSubscription(String chainId, String unitId) async {
    await _provider.startOrderHistoryListSubscription(chainId, unitId);
  }

  Future<void> stopOrderHistoryListSubscription() async {
    await _provider.stopOrderHistoryListSubscription();
  }
}
