import 'dart:async';

import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fa_prev/core/logger.dart';

class AwsCartMemoryProvider implements ICartProvider {
  late final IAuthProvider _authProvider;
  StreamController<Cart?> _cartController = BehaviorSubject<Cart?>();
  Cart? _cart;

  AwsCartMemoryProvider(this._authProvider);

  @override
  Cart? get cart => _cart;

  @override
  void resetCartInMemory() {
    _cart = null;
    _cartController.add(null);
  }

  @override
  Future<String> createAndSendOrderFromCart() async {
    log.d('AwsCartMemoryProvider.createAndSendOrderFromCart()=${_cart?.id}');
    try {
      if (_cart == null || _cart?.id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR, message: 'Cart is null.');
      }

      if (currentUnit == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'No unit selected when try to send cart.');
      }

      var variables = createOrderFromCartArguments(currentUnit!, _cart!);
      // var jsonString = json.encode(
      //   variables.toJson(),
      //   toEncodable: (object) => enumToString(object),
      // );
      // printWrapped(jsonString);

      var result = await GQL.amplify
          .execute(CreateOrderFromCartMutation(variables: variables));
      // log.d('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id;
      if (result.data != null && result.data?.createOrder != null) {
        id = result.data!.createOrder?.id;
        log.d('AwsCartMemoryProvider.createAndSendOrderFromCart().id=$id');
      }
      if (id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'Generated order is null!');
      }
      await clearCart();
      return id;
    } on Exception catch (e) {
      log.d('AwsCartMemoryProvider.createAndSendOrderFromCart.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<void> clearCart() async {
    if (_cart?.unitId != null) {
      await _deleteCartFromBackend(_cart!.unitId);
    }
    _cart = null;
    _cartController.add(null);
  }

  @override
  Future<Cart?> getCurrentCart(String unitId) async {
    log.d('AwsCartMemoryProvider.getCurrentCart()=$unitId');
    if (_cart == null || _cart?.unitId != unitId) {
      _cart = await _getCartFromBackEnd(unitId);
    }
    _cartController.add(_cart);
    return _cart;
  }

  @override
  Stream<Cart?> getCurrentCartStream(String unitId) async* {
    yield _cart;
    yield* _cartController.stream;
  }

  Future<Cart?> setPaymentMode(String unitId, PaymentMode mode) async {
    log.d('AwsCartMemoryProvider.setPaymentMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // log.d('AwsCartMemoryProvider.setPaymentMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(paymentMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  Future<Cart?> setServingMode(String unitId, ServingMode mode) async {
    log.d('AwsCartMemoryProvider.setServingMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // log.d('AwsCartMemoryProvider.setServingMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(servingMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    log.d('AwsCartMemoryProvider.updateCart.id=${cart?.id}');
    bool delete = cart != null && cart.items.isEmpty;
    // log.d('AwsCartMemoryProvider.updateCart.delete=$delete');
    if (delete) {
      await clearCart();
      return;
    }

    bool newCart = _cart == null || _cart?.id == null;
    // log.d('AwsCartMemoryProvider.updateCart.newCart=$newCart');
    if (cart != null) {
      if (newCart) {
        _cart = cart;
        await _saveCartToBackend(_cart!);
      } else {
        _cart = cart;
        await _updateCartOnBackend(_cart!);
      }
    }
    _cartController.add(_cart);
  }

  Future<Cart?> _getCartFromBackEnd(String unitId) async {
    User? user = await _authProvider.getAuthenticatedUserProfile();
    if (user == null) {
      throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.USER_NOT_LOGGED_IN,
        message: 'User not logged in. getAuthenticatedUserProfile() is null',
      );
    }
    log.d(
        'AwsCartMemoryProvider._getCartFromBackEnd().unit=$unitId, user=${user.id}');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      String? jsonCart = sp.getString(_getCartKey(unitId));
      // await sp.remove(_getCartKey(unitId));
      // log.d('AwsCartMemoryProvider._getCartFromBackEnd().json=$jsonCart');
      if (jsonCart == null) {
        return null;
      }

      Cart cart = Cart.fromJsonString(jsonCart);
      log.d('AwsCartMemoryProvider._getCartFromBackEnd().id=${cart.id}');
      return cart;
    } on Exception catch (e) {
      log.d('AwsCartMemoryProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    log.d('AwsCartMemoryProvider.CREATING CART IN BACKEND');
    try {
      String id = _getCartKey(cart.unitId);
      log.d('AwsCartMemoryProvider._saveCartToBackend().id=$id');
      _cart = cart.copyWith(id: id);
      return _updateCartOnBackend(_cart!);
    } on Exception catch (e) {
      log.d('AwsCartMemoryProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    log.d(
        'AwsCartMemoryProvider.******** UPDATING CART IN BACKEND=${cart.unitId}');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      return sp.setString(_getCartKey(cart.unitId), cart.toJsonString());
    } on Exception catch (e) {
      log.d('AwsCartMemoryProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String unitId) async {
    log.d('AwsCartMemoryProvider.******** DELETING CART IN BACKEND=$unitId');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      await sp.remove(_getCartKey(unitId));
      return true;
    } on Exception catch (e) {
      log.d('AwsCartMemoryProvider._deleteCartFromBackend.Exception: $e');
      rethrow;
    }
  }

  static String _getCartKey(String unitId) {
    return 'CART_$unitId';
  }
}
