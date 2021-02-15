import 'dart:async';

import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/models.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';


class CartRepository {

  final ICartProvider _cartProvider;

  CartRepository(this._cartProvider);
  
  Future<Cart> addProductToCart(GeoUnit unit, Product product, Variant variant) async {
    Cart _cart = await _cartProvider.getCurrentCart(unit.chainId, unit.unitId);
    if (_cart == null || _cart.orders == null) {
      _cart = Cart(orders: List<Order>(), place: await getPlacePref());
    }

    int index = _cart.orders.indexWhere((order) => order.product.id == product.id && order.variant.id == variant.id);
    if (index != -1) {
      Order existingOrder = _cart.orders[index];
      existingOrder.quantity++;
    } else {
      Order order = Order((_cart.orders.length + 1).toString(), product, variant, 1);
      _cart.orders.add(order);
    }

    await _cartProvider.updateCart(unit.chainId, unit.unitId, _cart);
    return _cart;
  }

  Future<Cart> removeProductFromCart(String chainId, String unitId, Product product, Variant variant) async {
    Cart _cart = await _cartProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    int index = _cart.orders.indexWhere((order) => order.product.id == product.id && order.variant.id == variant.id);
    if (index != -1) {
      Order existingOrder = _cart.orders[index];
      existingOrder.quantity--;
      if (existingOrder.quantity == 0) {
        _cart.orders.removeAt(index);
      }
    }

    await _cartProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> removeOrderFromCart(String chainId, String unitId, Order order) async {
    Cart _cart = await _cartProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    _cart.orders.removeWhere((o) => o.id == order.id);
    await _cartProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> updatePlaceInCart(GeoUnit unit) async {
    Cart _cart = await _cartProvider.getCurrentCart(unit.chainId, unit.unitId);
    if (_cart == null || _cart.orders == null) {
      return null;
    }
    _cart.place = unit.place;
    await _cartProvider.updateCart(unit.chainId, unit.unitId, _cart);
    return _cart;
  }

  Future<Cart> getCurrentCart(String chainId, String unitId) {
    return _cartProvider.getCurrentCart(chainId, unitId);
  }

  Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
    return _cartProvider.getCurrentCartStream(chainId, unitId);
  }

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
    await _cartProvider.createAndSendOrderFromCart(unit, paymentMethod);
  }

  Future<Cart> clearCart(GeoUnit unit) async {
    await _cartProvider.clearCart(unit.chainId, unit.unitId);
    return Cart(orders: List<Order>(), place: unit.place);
  }

  Future<Cart> clearPlaceInCart(GeoUnit unit) async {
    Cart cart = await getCurrentCart(unit.chainId, unit.unitId);
    if (cart != null) {
      cart.place = null;
      await _cartProvider.updateCart(unit.chainId, unit.unitId, cart);
    }
    return cart;
  }
}
