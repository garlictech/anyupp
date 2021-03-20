import 'dart:async';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';

class CartRepository {
  final IAuthProvider _authProvider;
  final IOrdersProvider _ordersProvider;

  CartRepository(this._ordersProvider, this._authProvider);

  Future<Cart> addProductToCart(GeoUnit unit, GeneratedProduct product, ProductVariant variant) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.chainId, unit.id);
    User user = await _authProvider.getAuthenticatedUserProfile();
    if (_cart == null || _cart.items == null) {
      _cart = Cart(
        userId: user.id,
        unitId: unit.id,
        takeAway: false,
        paymentMethod: PaymentMode(
          method: 'INAPP',
          name: 'STRIPE',
        ),
        place: await getPlacePref(),
        created: DateTime.now().millisecondsSinceEpoch,
        items: [
          CartItem(
            product: product,
            variant: variant,
            quantity: 1,
          )
        ],
      );
    }

    int index = _cart.items.indexWhere((order) => order.product?.id == product.id && order.variant.id == variant.id);
    if (index != -1) {
      // TODO AWS
      // OrderItem existingOrder = _cart.order.items[index];
      // Map<String, dynamic> data = existingOrder.toJson();
      // data['quantity'] = data['quatnity'] + 1;
      // existingOrder = OrderItem.fromJson(data);
      CartItem existingOrder = _cart.items[index].copyWith(quantity: _cart.items[index].quantity + 1);
      _cart.items[index] = existingOrder;
    } else {
      CartItem order = CartItem(
        product: product,
        variant: variant,
        quantity: 1,
      );
      // Order order = Order((_cart.orders.length + 1).toString(), product, variant, 1);
      _cart.items.add(order);
    }

    await _ordersProvider.updateCart(unit.chainId, unit.id, _cart);
    return _cart;
  }

  Future<Cart> removeProductFromCart(
      String chainId, String unitId, GeneratedProduct product, ProductVariant variant) async {
    Cart _cart = await _ordersProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    int index = _cart.items.indexWhere((order) => order.product.id == product.id && order.variant.id == variant.id);
    if (index != -1) {
      // TODO AWS
      // OrderItem existingOrder = _cart.order.items[index];
      // Map<String, dynamic> data = existingOrder.toJson();
      // data['quantity'] = data['quantity'] - 1;
      // existingOrder = OrderItem.fromJson(data);
      CartItem existingOrder = _cart.items[index].copyWith(quantity: _cart.items[index].quantity - 1);
      if (existingOrder.quantity == 0) {
        _cart.items.removeAt(index);
      }
    }

    await _ordersProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> removeOrderFromCart(String chainId, String unitId, CartItem order) async {
    Cart _cart = await _ordersProvider.getCurrentCart(chainId, unitId);
    if (_cart == null) {
      return null;
    }

    _cart.items.removeWhere((o) => o.id == order.id);
    await _ordersProvider.updateCart(chainId, unitId, _cart);
    return _cart;
  }

  Future<Cart> updatePlaceInCart(GeoUnit unit) async {
    Cart _cart = await _ordersProvider.getCurrentCart(unit.chainId, unit.id);
    if (_cart == null || _cart.items == null) {
      return null;
    }
    _cart =  _cart.copyWith(place: unit.place);
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
    await _ordersProvider.createAndSendOrderFromCart(unit, paymentMethod);
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
}
