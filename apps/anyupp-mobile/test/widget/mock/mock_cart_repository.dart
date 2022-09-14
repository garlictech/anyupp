import 'package:anyupp/graphql/generated/crud-api.graphql.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/cart.dart';
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
      Unit unit, OrderItem item, ServingMode servingMode) {
    throw UnimplementedError();
  }

  @override
  Future<Cart?> clearCart() async {
    _cart = null;
    return _cart;
  }

  @override
  Future<Cart?> clearPlaceInCart(Unit unit) async {
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
  Future<Cart?> updatePlaceInCart(Unit unit, Place place) async {
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

  @override
  OrderItem getOrderItem(
    String userId,
    Unit unit,
    Product product,
    ProductVariant variant,
    Map<ProductConfigSet, List<ProductConfigComponent>>
        configSets,
  ) {
    return OrderItem(
      productId: product.id,
      variantId: variant.id!,
      productName: product.name,
      priceShown: PriceShown(
        currency: unit.currency,
        pricePerUnit: variant.price,
        priceSum: variant.price,
        tax: product.tax,
        taxSum: 0,
      ),
      sumPriceShown: PriceShown(
        currency: unit.currency,
        pricePerUnit: variant.price,
        priceSum: variant.price,
        tax: product.tax,
        taxSum: 0,
      ),
      quantity: 1,
      statusLog: [],
      variantName: variant.variantName,
      productType: ProductType.food,
    );
  }
}
