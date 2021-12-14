import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:flutter_test/flutter_test.dart';

class MockCartRepository implements CartRepository {
  Cart? _cart;

  MockCartRepository(this._cart) : super();

  Stream<Cart?> getCurrentCartStream(String unitId) {
    return Stream.value(_cart);
  }

  Cart? get cart => _cart;

  @override
  Future<Cart?> addProductToCart(
      String unitId, OrderItem item, ServingMode servingMode) {
    throw UnimplementedError();
  }

  @override
  Future<Cart?> clearCart() async {
    _cart = null;
  }

  @override
  Future<Cart?> clearPlaceInCart(GeoUnit unit) async {
    return _cart;
  }

  @override
  Future<String> createAndSendOrderFromCart() async {
    return 'fake_cart_id';
  }

  @override
  Future<Cart?> getCurrentCart(String unitId) async {
    return _cart;
  }

  @override
  Future<Cart?> removeProductFromCart(String unitId, OrderItem item) async {
    return _cart;
  }

  @override
  Future<Cart?> setPaymentMode(String unitId, PaymentMode mode) async {
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    return;
  }

  @override
  Future<Cart?> updatePlaceInCart(GeoUnit unit, Place place) async {
    return _cart;
  }

  @override
  void resetCartInMemory() {
    _cart = null;
    return;
  }

  @override
  Future<Cart?> setServingMode(String unitId, ServingMode mode) async {
    return _cart;
  }
}
