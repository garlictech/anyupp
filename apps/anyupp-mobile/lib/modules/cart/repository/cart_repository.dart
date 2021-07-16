import 'dart:async';

import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';

class CartRepository {
  final IAuthProvider _authProvider;
  final IOrdersProvider _ordersProvider;

  CartRepository(this._ordersProvider, this._authProvider);

  Future<Cart> addProductToCart(GeoUnit unit, OrderItem item) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.id);
    User user = await _authProvider.getAuthenticatedUserProfile();
    if (_cart == null || _cart.items == null || _cart.items.isEmpty) {
      _cart = Cart(
        userId: user.id,
        unitId: unit.id,
        takeAway: false,
        paymentMode: PaymentMode(
          caption: 'inapp',
          method: 'inapp',
          type: 'stripe',
        ),
        place: await getPlacePref() ?? Place(seat: '00', table: '00'),
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

    await _ordersProvider.updateCart(unit.id, _cart);
    return _cart;
  }

  Future<Cart> removeProductFromCart(String unitId, OrderItem item) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unitId);
    if (_cart == null) {
      await _ordersProvider.updateCart(unitId, _cart);
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

    await _ordersProvider.updateCart(unitId, _cart);
    return _cart;
  }

  Future<Cart> removeOrderFromCart(String unitId, OrderItem order) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unitId);
    if (_cart == null) {
      return null;
    }

    List<OrderItem> items = List<OrderItem>.from(_cart.items);
    items.removeWhere((o) => o.id == order.id);
    _cart = _cart.copyWith(items: items);
    await _ordersProvider.updateCart(unitId, _cart);
    return _cart;
  }

  Future<Cart> updatePlaceInCart(GeoUnit unit) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.id);
    if (_cart == null || _cart.items == null) {
      return null;
    }
    _cart = _cart.copyWith(place: unit.place);
    await _ordersProvider.updateCart(unit.id, _cart);
    return _cart;
  }

  Future<Cart> getCurrentCart(String unitId) {
    return _ordersProvider.getCurrentCart(unitId);
  }

  Stream<Cart> getCurrentCartStream(String unitId) {
    return _ordersProvider.getCurrentCartStream(unitId);
  }

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
    await _ordersProvider.createAndSendOrderFromCart();
  }

  Future<Cart> clearCart() async {
    await _ordersProvider.clearCart();
    return null;
  }

  Future<Cart> clearPlaceInCart(GeoUnit unit) async {
    Cart cart = await getCurrentCart(unit.id);
    if (cart != null) {
      cart = cart.copyWith(place: null);
      await _ordersProvider.updateCart(unit.id, cart);
    }
    return cart;
  }

  Future<void> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    return _ordersProvider.addInvoiceInfo(invoiceInfo);
  }
}
