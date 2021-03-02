import 'dart:async';

import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';

class CartRepository {
  final ICartProvider _cartProvider;

  CartRepository(this._cartProvider);

  Future<Cart> addProductToCart(User user, GeoUnit unit, Product product, ProductVariant variant) async {
    Cart _cart = await _cartProvider.getCurrentCart(unit.chainId, unit.unitId);
    if (_cart == null || _cart.order == null || _cart.order.items == null) {
      _cart = Cart(
          order: Order(
            unitId: unit.unitId,
            userId: user.id, // TODO AWS!!!
            items: List<OrderItem>(),
          ),
          place: await getPlacePref());
    }

    int index = _cart.order.items.indexWhere((order) => order.productId == product.id && order.variantId == variant.id);
    if (index != -1) {
      OrderItem existingOrder = _cart.order.items[index];
      Map<String, dynamic> data = existingOrder.toJson();
      data['quantity'] = data['quatnity'] + 1;
      existingOrder = OrderItem.fromJson(data);
    } else {
      OrderItem order = OrderItem(
          orderId: '',
          id: (_cart.order.items.length + 1).toString(),
          productId: product.id,
          variantId: variant.id,
          quantity: 1);
      // Order order = Order((_cart.orders.length + 1).toString(), product, variant, 1);
      _cart.order.items.add(order);
    }

    await _cartProvider.updateCart(unit.chainId, unit.unitId, _cart);
    return _cart;
  }

  Future<Cart> removeProductFromCart(String chainId, String unitId, Product product, ProductVariant variant) async {
    Cart _cart = await _cartProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    int index = _cart.order.items.indexWhere((order) => order.productId == product.id && order.variantId == variant.id);
    if (index != -1) {
      OrderItem existingOrder = _cart.order.items[index];
      Map<String, dynamic> data = existingOrder.toJson();
      data['quantity'] = data['quatnity'] - 1;
      existingOrder = OrderItem.fromJson(data);
      if (existingOrder.quantity == 0) {
        _cart.order.items.removeAt(index);
      }
    }

    await _cartProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> removeOrderFromCart(String chainId, String unitId, OrderItem order) async {
    Cart _cart = await _cartProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    _cart.order.items.removeWhere((o) => o.id == order.id);
    await _cartProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> updatePlaceInCart(GeoUnit unit) async {
    Cart _cart = await _cartProvider.getCurrentCart(unit.chainId, unit.unitId);
    if (_cart == null || _cart.order == null || _cart.order.items == null) {
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

  Future<Cart> clearCart(User user, GeoUnit unit) async {
    await _cartProvider.clearCart(unit.chainId, unit.unitId);
    return Cart(
        order: Order(
          unitId: unit.unitId,
          userId: user.id, // TODO AWS!!!
          items: List<OrderItem>(),
        ),
        place: unit.place);
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
