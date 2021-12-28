import 'dart:async';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/Cart.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';

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
    print('AwsCartProvider.createAndSendOrderFromCart()=${_cart?.id}');
    try {
      if (_cart == null || _cart?.id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR, message: 'Cart is null.');
      }

      var result = await GQL.amplify.execute(CreateOrderFromCartMutation(
          variables: CreateOrderFromCartArguments(
        cartId: _cart!.id!,
      )));

      // print('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id;
      if (result.data != null && result.data?.createOrderFromCart != null) {
        id = result.data!.createOrderFromCart;
        print('AwsCartProvider.createAndSendOrderFromCart().id=$id');
      }
      await clearCart();
      if (id == null) {
        throw CartException(
            code: CartException.UNKNOWN_ERROR,
            message: 'Generated order is null!');
      }
      return id;
    } on Exception catch (e) {
      print('AwsCartProvider.createAndSendOrderFromCart.Exception: $e');
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
    print('AwsCartProvider.setPaymentMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // print('AwsCartProvider.setPaymentMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(paymentMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  Future<Cart?> setServingMode(String unitId, ServingMode mode) async {
    print('AwsCartProvider.setServingMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    // print('AwsCartProvider.setServingMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(servingMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    print('AwsCartProvider.updateCart.id=${cart?.id}');
    bool delete = cart != null && cart.items.isEmpty;
    // print('AwsCartProvider.updateCart.delete=$delete');
    if (delete) {
      await _deleteCartFromBackend(cart.id!);
      _cart = null;
      _cartController.add(_cart);
      return;
    }

    bool newCart = _cart == null || _cart?.id == null;
    // print('AwsCartProvider.updateCart.newCart=$newCart');
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
    // print(
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
        print('AwsCartProvider._getCartFromBackEnd().error()=${result.errors}');
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      // print('AwsCartProvider._getCartFromBackEnd().result=${result.data}');
      if (result.data == null || result.data?.listCarts == null) {
        return null;
      }

      var items = result.data?.listCarts?.items;
      if (items != null && items.isNotEmpty) {
        // print('json[items] is List=${items[0]['items'] is List}');
        Cart cart = Cart.fromJson(items[0]!.toJson());
        // print('AwsCartProvider._getCartFromBackEnd().id=${cart.id}');
        return cart;
      }

      return null;
    } on Exception catch (e) {
      print('AwsCartProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    print('AwsCartProvider.CREATING CART IN BACKEND');
    try {
      var result = await GQL.amplify.execute(CreateCartMutation(
        variables: CreateCartArguments(
          createCartInput: CreateCartInput.fromJson(
            _getCartMutationVariablesFromCart(cart),
          ),
        ),
      ));
      // print('******** CREATING CART IN BACKEND.result.data=${result.data}');
      // print(
      //     'AwsCartProvider.CREATING CART IN BACKEND.result.errors=${result.errors}');

      String? id = result.data?.createCart?.id;
      // print('AwsCartProvider._saveCartToBackend().id=$id');
      if (id != null) {
        _cart = cart.copyWith(id: id);
        _cartController.add(_cart);
      }

      return !result.hasErrors;
    } on Exception catch (e) {
      print('AwsCartProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    print(
        'AwsCartProvider.******** UPDATING CART IN BACKEND.paymentMode=${cart.paymentMode}');
    try {
      var result = await GQL.amplify.execute(UpdateCartMutation(
          variables: UpdateCartArguments(
        updateCartInput:
            UpdateCartInput.fromJson(_getCartMutationVariablesFromCart(cart)),
      )));

      // print('******** UPDATING CART IN BACKEND.result.data=${result.data}');
      // print('******** UPDATING CART IN BACKEND.result.errors=${result.errors}');

      return !result.hasErrors;
    } on Exception catch (e) {
      print('AwsCartProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String cartId) async {
    print('AwsCartProvider.******** DELETING CART IN BACKEND=$cartId');
    try {
      var result = await GQL.amplify.execute(DeleteCartMutation(
        variables: DeleteCartArguments(cartId: cartId),
      ));

      return !result.hasErrors;
    } on Exception catch (e) {
      print('AwsCartProvider._deleteCartFromBackend.Exception: $e');
      rethrow;
    }
  }

  Map<String, dynamic> _getCartMutationVariablesFromCart(Cart cart) {
    // print('_getCartMutationVariablesFromCart().cart=$cart');

    return {
      if (cart.id != null) 'id': cart.id,
      'unitId': cart.unitId,
      'userId': cart.userId,
      'servingMode': enumToString(cart.servingMode),
      'orderPolicy': enumToString(cart.orderPolicy),
      'items': cart.items.map((item) {
        return {
          'productId': item.productId,
          'variantId': item.variantId,
          'packagingFee': item.packagingFee,
          'productType': 'FOOD',
          'created': DateTime.now().millisecondsSinceEpoch.toInt(),
          'productName': {
            'en': item.productName.en,
            'de': item.productName.de,
            'hu': item.productName.hu,
          },
          'priceShown': {
            'currency': item.priceShown.currency,
            'pricePerUnit': item.priceShown.pricePerUnit,
            'priceSum': item.priceShown.priceSum,
            'tax': item.priceShown.tax,
            'taxSum': item.priceShown.taxSum,
          },
          'sumPriceShown': {
            'currency': item.priceShown.currency,
            'pricePerUnit': item.getPrice(),
            'priceSum': item.getPrice() * item.quantity,
            'tax': item.priceShown.tax,
            'taxSum': item.priceShown.taxSum,
          },
          'statusLog': [
            {
              'userId': cart.userId,
              'status': 'none',
              'ts': DateTime.now().millisecond,
            }
          ],
          "allergens": item.allergens,
          "image": item.image,
          'quantity': item.quantity,
          'variantName': {
            'en': item.variantName.en,
            'de': item.variantName.de,
            'hu': item.variantName.hu,
          },
          'configSets': item.selectedConfigMap?.keys.map((configSet) {
            return {
              "name": {
                'en': configSet.name.en,
                'de': configSet.name.de,
                'hu': configSet.name.hu,
              },
              "productSetId": configSet.productSetId,
              "type": configSet.type,
              "items": item.selectedConfigMap != null
                  ? item.selectedConfigMap![configSet]?.map((configComponent) {
                      return {
                        "allergens": configComponent.allergens
                            ?.map((e) => e.toString().split(".").last)
                            .toList(),
                        "price": configComponent.price,
                        "productComponentId":
                            configComponent.productComponentId,
                        "name": {
                          'en': configComponent.name.en,
                          'de': configComponent.name.de,
                          'hu': configComponent.name.hu,
                        },
                      };
                    }).toList()
                  : null
            };
          }).toList(),
        };
      }).toList(),
      'paymentMode': cart.paymentMode != null
          ? {
              'type': enumToString(cart.paymentMode!.type),
              'caption': cart.paymentMode!.caption,
              'method': enumToString(cart.paymentMode!.method),
            }
          : null,
      'takeAway': false,
      'place': cart.place != null
          ? {
              'table': cart.place!.table,
              'seat': cart.place!.seat,
            }
          : null,
    };
  }
}
