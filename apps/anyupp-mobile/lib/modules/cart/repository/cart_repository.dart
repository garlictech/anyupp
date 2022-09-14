import 'dart:async';

import 'package:collection/collection.dart';
import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/cart/utils/cart_to_order_calculations.dart';
import '/modules/login/login.dart';
import '/shared/auth/auth.dart';
import '/shared/utils/md5_hash.dart';
import '/shared/utils/place_preferences.dart';

class CartRepository implements ICartProvider {
  final IAuthProvider _authProvider;
  final ICartProvider _cartProvider;

  CartRepository(this._cartProvider, this._authProvider);

  Cart? get cart => _cartProvider.cart;

  Future<Cart?> addProductToCart(
      Unit unit, OrderItem item, ServingMode servingMode) async {
    Cart? cart = await _cartProvider.getCurrentCart(unit.id);
    User? user = await _authProvider.getAuthenticatedUserProfile();
    if (user == null) {
      throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.USER_NOT_LOGGED_IN,
        message: 'User not logged in. getAuthenticatedUserProfile() is null',
      );
    }
    if (cart == null || cart.items.isEmpty) {
      cart = Cart(
        version: 1,
        userId: user.id,
        unitId: unit.id,
        guestLabel: generateHash(user.id),
        servingMode: servingMode,
        orderMode: OrderMode.instant,
        packagingFeeTaxPercentage: unit.packagingTaxPercentage,
        place: await getPlacePref(unit.id) ??
            Place(seat: EMPTY_SEAT, table: EMPTY_TABLE),
        orderPolicy: unit.orderPolicy,
        paymentMode: PaymentMode(
          method: PaymentMethod.cash,
          type: PaymentType.cash,
        ),
        hasRated: false,
        ratingPolicies: unit.ratingPolicies,
        serviceFeePolicy: unit.serviceFeePolicy,
        soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
        tipPolicy: unit.tipPolicy,
        items: [
          item.copyWith(quantity: 0),
        ],
      );
    }

    int index = cart.items.indexWhere((order) =>
        order.productId == item.productId &&
        order.variantId == item.variantId &&
        DeepCollectionEquality()
            .equals(order.getConfigIdMap(), item.getConfigIdMap()));
    if (index != -1) {
      OrderItem existingOrder = cart.items[index]
          .copyWith(quantity: cart.items[index].quantity + item.quantity);
      List<OrderItem> items = List<OrderItem>.from(cart.items);
      items[index] = existingOrder;
      cart = cart.copyWith(items: items);
    } else {
      List<OrderItem> items = List<OrderItem>.from(cart.items);
      items.add(item);
      cart = cart.copyWith(items: items);
    }

    await _cartProvider.updateCart(unit.id, cart);
    return cart;
  }

  Future<Cart?> removeProductFromCart(String unitId, OrderItem item) async {
    Cart? cart = await _cartProvider.getCurrentCart(unitId);
    if (cart == null) {
      await _cartProvider.updateCart(unitId, cart);
      return null;
    }

    int index = cart.items.indexWhere((order) =>
        order.productId == item.productId &&
        order.variantId == item.variantId &&
        DeepCollectionEquality()
            .equals(order.getConfigIdMap(), item.getConfigIdMap()));
    if (index != -1) {
      OrderItem existingOrder =
          cart.items[index].copyWith(quantity: cart.items[index].quantity - 1);
      if (existingOrder.quantity <= 0) {
        List<OrderItem> items = List<OrderItem>.from(cart.items);
        items.removeWhere((order) =>
            order.productId == item.productId &&
            order.variantId == item.variantId &&
            DeepCollectionEquality()
                .equals(order.getConfigIdMap(), item.getConfigIdMap()));
        cart = cart.copyWith(items: items);
      } else {
        List<OrderItem> items = List<OrderItem>.from(cart.items);
        items[index] = existingOrder.copyWith();
        cart = cart.copyWith(items: items);
      }
    }

    await _cartProvider.updateCart(unitId, cart);
    return cart;
  }

  Future<Cart?> updatePlaceInCart(Unit unit, Place place) async {
    Cart? cart = await _cartProvider.getCurrentCart(unit.id);
    if (cart == null || cart.items.isEmpty) {
      return null;
    }
    // await setPlacePref(place);
    cart = cart.copyWith(place: place);
    await _cartProvider.updateCart(unit.id, cart);
    return cart;
  }

  Future<Cart?> getCurrentCart(String unitId) {
    return _cartProvider.getCurrentCart(unitId);
  }

  Stream<Cart?> getCurrentCartStream(String unitId) {
    return _cartProvider.getCurrentCartStream(unitId);
  }

  // Future<void> createAndSendOrderFromCart(Unit unit, String paymentMethod) async {
  //   await _cartProvider.createAndSendOrderFromCart();
  // }

  Future<Cart?> clearCart() async {
    log.d('CartRepository.clearCart()');
    await _cartProvider.clearCart();
    return null;
  }

  Future<Cart?> clearPlaceInCart(Unit unit) async {
    // log.d('CartRepository.clearPlaceInCart()=${unit.id}');
    Cart? cart = await getCurrentCart(unit.id);
    if (cart != null) {
      cart = cart.copyWith(place: Place(seat: EMPTY_SEAT, table: EMPTY_TABLE));
      await clearPlacePref(unit.id);
      await _cartProvider.updateCart(unit.id, cart);
    }
    return cart;
  }

  @override
  Future<String> createAndSendOrderFromCart() async {
    String orderId = await _cartProvider.createAndSendOrderFromCart();
    return orderId;
  }

  @override
  Future<Cart?> setPaymentMode(String unitId, PaymentMode mode) {
    return _cartProvider.setPaymentMode(unitId, mode);
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) {
    return _cartProvider.updateCart(unitId, cart);
  }

  @override
  Future<Cart?> setServingMode(String unitId, ServingMode mode) {
    return _cartProvider.setServingMode(unitId, mode);
  }

  @override
  void resetCartInMemory() {
    return _cartProvider.resetCartInMemory();
  }

  OrderItem getOrderItem(
    String userId,
    Unit unit,
    Product product,
    ProductVariant variant,
    Map<ProductConfigSet, List<ProductConfigComponent>> configSets,
  ) {
    return OrderItem(
      productType: product.productType,
      serviceFee: getServiceFee(
        unit.serviceFeePolicy,
        PriceShown(
          currency: unit.currency,
          pricePerUnit: variant.price,
          priceSum: variant.price,
          tax: product.tax,
          taxSum: getTaxSum(variant.price, product.tax),
        ),
      ),
      productId: product.id,
      variantId: variant.id!,
      image: product.image,
      priceShown: PriceShown(
        currency: unit.currency,
        pricePerUnit: variant.price,
        priceSum: variant.price,
        tax: product.tax,
        taxSum: getTaxSum(variant.price, product.tax),
      ),
      sumPriceShown: PriceShown(
        currency: unit.currency,
        pricePerUnit: variant.price,
        priceSum: variant.price,
        tax: product.tax,
        taxSum: getTaxSum(variant.price, product.tax),
      ),
      allergens: product.allergens,
      productName: product.name,
      variantName: variant.variantName,
      statusLog: [
        StatusLog(
          userId: userId,
          status: OrderStatus.none,
          ts: 0,
        ),
      ],
      quantity: 1,
      netPackagingFee: variant.netPackagingFee,
      selectedConfigMap: configSets,
      configSets: _getConfigSets(configSets),
    );
  }

  List<OrderItemConfigSet>? _getConfigSets(
      Map<ProductConfigSet, List<ProductConfigComponent>> configSets) {
    if (configSets.isEmpty) {
      return null;
    }

    List<OrderItemConfigSet> result = [];
    configSets.forEach((key, value) {
      result.add(OrderItemConfigSet(
        name: key.name,
        productSetId: key.productSetId,
        type: key.type,
        items: value
            .map((item) => OrderItemConfigComponent(
                  name: item.name,
                  price: item.price,
                  productComponentId: item.productComponentId,
                  netPackagingFee: item.netPackagingFee,
                  allergens: item.allergens,
                ))
            .toList(),
      ));
    });
    return result;
  }
}
