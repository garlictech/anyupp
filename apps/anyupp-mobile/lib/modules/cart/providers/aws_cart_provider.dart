import 'dart:async';

import 'package:fa_prev/core/logger.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';

@deprecated
class AwsCartProvider implements ICartProvider {
  late final IAuthProvider _authProvider;
  StreamController<Cart?> _cartController = BehaviorSubject<Cart?>();
  Cart? _cart;

  AwsCartProvider(this._authProvider);

  @override
  Cart? get cart => _cart;

  @override
  void resetCartInMemory() {
    _cart = null;
    _cartController.add(null);
  }

  @override
  Future<String> createAndSendOrderFromCart() async {
    log.d('AwsCartProvider.createAndSendOrderFromCart()=${_cart?.id}');
    try {
      if (_cart == null || _cart?.id == null || currentUnit == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR, message: 'Cart is null.');
      }

      if (currentUnit == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'No unit selected when try to send cart.');
      }

      var result = await GQL.amplify.execute(CreateOrderFromCartMutation(
          variables: createOrderFromCartArguments(
        currentUnit!,
        _cart!,
      )));

      // log.d('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id;
      if (result.data != null && result.data?.createOrder != null) {
        id = result.data!.createOrder?.id;
        log.d('AwsCartProvider.createAndSendOrderFromCart().id=$id');
      }
      await clearCart();
      if (id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'Generated order is null!');
      }
      return id;
    } on Exception catch (e) {
      log.e('AwsCartProvider.createAndSendOrderFromCart.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<void> clearCart() async {
    if (_cart != null && _cart?.id != null) {
      await _deleteCartFromBackend(_cart!.id!);
      _cart = null;
      _cartController.add(null);
    }
  }

  @override
  Future<Cart?> getCurrentCart(String unitId) async {
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
    log.d('AwsCartProvider.setPaymentMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // log.d('AwsCartProvider.setPaymentMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(paymentMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  Future<Cart?> setServingMode(String unitId, ServingMode mode) async {
    log.d('AwsCartProvider.setServingMode()=$mode');
    // Cart? _cart = await getCurrentCart(unitId);
    // log.d('AwsCartProvider.setServingMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart!.copyWith(servingMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    log.d('AwsCartProvider.updateCart.id=${cart?.id}');
    bool delete = cart != null && cart.items.isEmpty;
    // log.d('AwsCartProvider.updateCart.delete=$delete');
    if (delete) {
      await _deleteCartFromBackend(cart.id!);
      _cart = null;
      _cartController.add(_cart);
      return;
    }

    bool newCart = _cart == null || _cart?.id == null;
    // log.d('AwsCartProvider.updateCart.newCart=$newCart');
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
    // log.d(
    //     'AwsCartProvider._getCartFromBackEnd().unit=$unitId, user=${user.id}');
    try {
      var result = await GQL.amplify.execute(
          GetCurrentCartQuery(
            variables: GetCurrentCartArguments(
              userId: user.id,
              unitId: unitId,
            ),
          ),
          fetchPolicy: FetchPolicy.networkOnly);
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      // log.d('AwsCartProvider._getCartFromBackEnd().result=${result.data}');
      if (result.data == null || result.data?.listCarts == null) {
        return null;
      }

      var items = result.data?.listCarts?.items;
      if (items != null && items.isNotEmpty) {
        // log.d('json[items] is List=${items[0]['items'] is List}');
        Cart cart = Cart.fromJson(items[0]!.toJson());
        // log.d('AwsCartProvider._getCartFromBackEnd().id=${cart.id}');
        return cart;
      }

      return null;
    } on Exception catch (e) {
      log.e('AwsCartProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    log.d('AwsCartProvider.CREATING CART IN BACKEND');
    try {
      var result = await GQL.amplify.execute(CreateCartMutation(
        variables: createCartArguments(cart),
        // variables: CreateCartArguments(
        //   createCartInput: _createCartInput(cart),
        // ),
      ));
      log.d('******** CREATING CART IN BACKEND.result.data=${result.data}');
      if (result.hasErrors) {
        log.d('AwsCartProvider._saveCartToBackend().error()=${result.errors}');
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id = result.data?.createCart?.id;
      log.d('AwsCartProvider._saveCartToBackend().id=$id');
      if (id != null) {
        _cart = cart.copyWith(id: id);
        _cartController.add(_cart);
      }

      return !result.hasErrors;
    } on Exception catch (e) {
      log.e('AwsCartProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    log.d(
        'AwsCartProvider.******** UPDATING CART IN BACKEND[${cart.id}].paymentMode=${cart.paymentMode}');
    try {
      var result = await GQL.amplify.execute(UpdateCartMutation(
          variables: UpdateCartArguments(
        updateCartInput: updateCartInput(cart),
      )));

      if (result.hasErrors) {
        log.d(
            'AwsCartProvider._updateCartOnBackend().error()=${result.errors}');
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }
      // log.d('******** UPDATING CART IN BACKEND.result.data=${result.data}');
      // log.d('******** UPDATING CART IN BACKEND.result.errors=${result.errors}');

      return !result.hasErrors;
    } on Exception catch (e) {
      log.e('AwsCartProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String cartId) async {
    log.d('AwsCartProvider.******** DELETING CART IN BACKEND=$cartId');
    try {
      var result = await GQL.amplify.execute(DeleteCartMutation(
        variables: DeleteCartArguments(cartId: cartId),
      ));

      return !result.hasErrors;
    } on Exception catch (e) {
      log.e('AwsCartProvider._deleteCartFromBackend.Exception: $e');
      rethrow;
    }
  }
}
