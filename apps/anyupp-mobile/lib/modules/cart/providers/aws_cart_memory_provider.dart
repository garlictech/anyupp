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
    print('AwsCartMemoryProvider.createAndSendOrderFromCart()=${_cart?.id}');
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
      // print('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id;
      if (result.data != null && result.data?.createOrder != null) {
        id = result.data!.createOrder?.id;
        print('AwsCartMemoryProvider.createAndSendOrderFromCart().id=$id');
      }
      if (id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'Generated order is null!');
      }
      await clearCart();
      return id;
    } on Exception catch (e) {
      print('AwsCartMemoryProvider.createAndSendOrderFromCart.Exception: $e');
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
    print('AwsCartMemoryProvider.getCurrentCart()=$unitId');
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
    print('AwsCartMemoryProvider.setPaymentMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // print('AwsCartMemoryProvider.setPaymentMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(paymentMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  Future<Cart?> setServingMode(String unitId, ServingMode mode) async {
    print('AwsCartMemoryProvider.setServingMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // print('AwsCartMemoryProvider.setServingMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(servingMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    print('AwsCartMemoryProvider.updateCart.id=${cart?.id}');
    bool delete = cart != null && cart.items.isEmpty;
    // print('AwsCartMemoryProvider.updateCart.delete=$delete');
    if (delete) {
      await clearCart();
      return;
    }

    bool newCart = _cart == null || _cart?.id == null;
    // print('AwsCartMemoryProvider.updateCart.newCart=$newCart');
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
    print(
        'AwsCartMemoryProvider._getCartFromBackEnd().unit=$unitId, user=${user.id}');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      String? jsonCart = sp.getString(_getCartKey(unitId));
      // await sp.remove(_getCartKey(unitId));
      // print('AwsCartMemoryProvider._getCartFromBackEnd().json=$jsonCart');
      if (jsonCart == null) {
        return null;
      }

      Cart cart = Cart.fromJsonString(jsonCart);
      print('AwsCartMemoryProvider._getCartFromBackEnd().id=${cart.id}');
      return cart;
    } on Exception catch (e) {
      print('AwsCartMemoryProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    print('AwsCartMemoryProvider.CREATING CART IN BACKEND');
    try {
      String id = _getCartKey(cart.unitId);
      print('AwsCartMemoryProvider._saveCartToBackend().id=$id');
      _cart = cart.copyWith(id: id);
      return _updateCartOnBackend(_cart!);
    } on Exception catch (e) {
      print('AwsCartMemoryProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    print(
        'AwsCartMemoryProvider.******** UPDATING CART IN BACKEND=${cart.unitId}');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      return sp.setString(_getCartKey(cart.unitId), cart.toJsonString());
    } on Exception catch (e) {
      print('AwsCartMemoryProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String unitId) async {
    print('AwsCartMemoryProvider.******** DELETING CART IN BACKEND=$unitId');
    try {
      // await Future.delayed(Duration(milliseconds: 500));
      var sp = await SharedPreferences.getInstance();
      await sp.remove(_getCartKey(unitId));
      return true;
    } on Exception catch (e) {
      print('AwsCartMemoryProvider._deleteCartFromBackend.Exception: $e');
      rethrow;
    }
  }

  static String _getCartKey(String unitId) {
    return 'CART_$unitId';
  }
}
