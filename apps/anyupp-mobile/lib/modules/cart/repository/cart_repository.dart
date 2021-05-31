import 'dart:async';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:flutter/foundation.dart';
import 'package:collection/collection.dart';

class CartRepository {
  final IAuthProvider _authProvider;
  final IOrdersProvider _ordersProvider;

  CartRepository(this._ordersProvider, this._authProvider);

  Future<Cart> addProductToCart(GeoUnit unit, OrderItem item) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.chainId, unit.id);
    User user = await _authProvider.getAuthenticatedUserProfile();
    if (_cart == null || _cart.items == null || _cart.items.isEmpty) {
      _cart = Cart(
        userId: user.id,
        unitId: unit.id,
        takeAway: false,
        paymentMode: PaymentMode(
          method: 'inapp', // TODO
          type: 'stripe', // TODO
        ),
        place: await getPlacePref() ?? Place(seat: '00', table: '00'), // TODO
        items: [
          item.copyWith(quantity: 0),
        ],
      );
    }

    int index = _cart.items.indexWhere((order) =>
        order.productId == item.productId &&
        order.variantId == item.variantId &&
        DeepCollectionEquality().equals(order.getConfigIdMap(), item.getConfigIdMap()));
    if (index != -1) {
      OrderItem existingOrder = _cart.items[index].copyWith(quantity: _cart.items[index].quantity + 1);
      List<OrderItem> items = List<OrderItem>.from(_cart.items);
      items[index] = existingOrder;
      _cart = _cart.copyWith(items: items);
    } else {
      List<OrderItem> items = List<OrderItem>.from(_cart.items);
      items.add(item.copyWith(quantity: 1));
      _cart = _cart.copyWith(items: items);
    }

    await _ordersProvider.updateCart(unit.chainId, unit.id, _cart);
    return _cart;
  }

  Future<Cart> removeProductFromCart(String chainId, String unitId, OrderItem item) async {
    Cart _cart = await _ordersProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      await _ordersProvider.updateCart(chainId, unitId, _cart);
      return null;
    }

    int index = _cart.items.indexWhere((order) =>
        order.productId == item.productId &&
        order.variantId == item.variantId &&
        DeepCollectionEquality().equals(order.getConfigIdMap(), item.getConfigIdMap()));
    if (index != -1) {
      OrderItem existingOrder = _cart.items[index].copyWith(quantity: _cart.items[index].quantity - 1);
      if (existingOrder.quantity <= 0) {
        List<OrderItem> items = List<OrderItem>.from(_cart.items);
        items.removeWhere((order) =>
            order.productId == item.productId &&
            order.variantId == item.variantId &&
            DeepCollectionEquality().equals(order.getConfigIdMap(), item.getConfigIdMap()));
        _cart = _cart.copyWith(items: items);
      } else {
        List<OrderItem> items = List<OrderItem>.from(_cart.items);
        items[index] = existingOrder.copyWith();
        _cart = _cart.copyWith(items: items);
      }
    }

    await _ordersProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> removeOrderFromCart(String chainId, String unitId, OrderItem order) async {
    Cart _cart = await _ordersProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    List<OrderItem> items = List<OrderItem>.from(_cart.items);
    items.removeWhere((o) => o.id == order.id);
    _cart = _cart.copyWith(items: items);
    await _ordersProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> updatePlaceInCart(GeoUnit unit) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.chainId, unit.id);
    if (_cart == null || _cart.items == null) {
      return null;
    }
    _cart = _cart.copyWith(place: unit.place);
    await _ordersProvider.updateCart(unit.chainId, unit.id, _cart);
    return _cart;
  }

  Future<Cart> getCurrentCart(String chainId, String unitId) {
    return _ordersProvider.getCurrentCart(chainId, unitId);
  }

  Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
    return _ordersProvider.getCurrentCartStream(chainId, unitId);
  }

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
    await _ordersProvider.createAndSendOrderFromCart();
  }

  Future<Cart> clearCart(User user, GeoUnit unit) async {
    await _ordersProvider.clearCart(unit.chainId, unit.id);
    return null;
  }

  Future<Cart> clearPlaceInCart(GeoUnit unit) async {
    Cart cart = await getCurrentCart(unit.chainId, unit.id);
    if (cart != null) {
      cart = cart.copyWith(place: null);
      await _ordersProvider.updateCart(unit.chainId, unit.id, cart);
    }
    return cart;
  }

  Future<bool> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    return _ordersProvider.addInvoiceInfo(invoiceInfo);
  }
}
