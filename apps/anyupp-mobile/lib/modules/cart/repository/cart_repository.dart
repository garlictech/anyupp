import 'dart:async';

import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class CartRepository implements ICartProvider {
  final IAuthProvider _authProvider;
  final ICartProvider _cartProvider;

  CartRepository(this._cartProvider, this._authProvider);

  Cart? get cart => _cartProvider.cart;

  Future<Cart?> addProductToCart(String unitId, OrderItem item, ServingMode servingMode) async {
    Cart? _cart = await _cartProvider.getCurrentCart(unitId);
    User? user = await _authProvider.getAuthenticatedUserProfile();
    if (user == null) {
      throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.USER_NOT_LOGGED_IN,
        message: 'User not logged in. getAuthenticatedUserProfile() is null',
      );
    }
    if (_cart == null || _cart.items.isEmpty) {
      _cart = Cart(
        userId: user.id,
        unitId: unitId,
        servingMode: servingMode,
        // paymentMode: PaymentMode(
        //   caption: 'inapp',
        //   method: PaymentMethod.inapp,
        //   type: PaymentType.stripe,
        // ),
        place: await getPlacePref() ?? Place(seat: EMPTY_SEAT, table: EMPTY_TABLE),
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
      OrderItem existingOrder = _cart.items[index].copyWith(quantity: _cart.items[index].quantity + item.quantity);
      List<OrderItem> items = List<OrderItem>.from(_cart.items);
      items[index] = existingOrder;
      _cart = _cart.copyWith(items: items);
    } else {
      List<OrderItem> items = List<OrderItem>.from(_cart.items);
      items.add(item);
      _cart = _cart.copyWith(items: items);
    }

    await _cartProvider.updateCart(unitId, _cart);
    return _cart;
  }

  Future<Cart?> removeProductFromCart(String unitId, OrderItem item) async {
    Cart? _cart = await _cartProvider.getCurrentCart(unitId);
    if (_cart == null) {
      await _cartProvider.updateCart(unitId, _cart);
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

    await _cartProvider.updateCart(unitId, _cart);
    return _cart;
  }

  Future<Cart?> updatePlaceInCart(GeoUnit unit, Place place) async {
    Cart? _cart = await _cartProvider.getCurrentCart(unit.id);
    if (_cart == null || _cart.items.isEmpty) {
      return null;
    }
    _cart = _cart.copyWith(place: place);
    await _cartProvider.updateCart(unit.id, _cart);
    return _cart;
  }

  Future<Cart?> getCurrentCart(String unitId) {
    return _cartProvider.getCurrentCart(unitId);
  }

  Stream<Cart?> getCurrentCartStream(String unitId) {
    return _cartProvider.getCurrentCartStream(unitId);
  }

  // Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
  //   await _cartProvider.createAndSendOrderFromCart();
  // }

  Future<Cart?> clearCart() async {
    await _cartProvider.clearCart();
    return null;
  }

  Future<Cart?> clearPlaceInCart(GeoUnit unit) async {
    Cart? cart = await getCurrentCart(unit.id);
    if (cart != null) {
      cart = cart.copyWith(place: Place(seat: EMPTY_SEAT, table: EMPTY_TABLE));
      await _cartProvider.updateCart(unit.id, cart);
    }
    return cart;
  }

  @override
  Future<String> createAndSendOrderFromCart() {
    return _cartProvider.createAndSendOrderFromCart();
  }

  @override
  Future<Cart?> setPaymentMode(String unitId, PaymentMode mode) {
    return _cartProvider.setPaymentMode(unitId, mode);
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) {
    return _cartProvider.updateCart(unitId, cart);
  }
}
