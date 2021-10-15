import 'dart:async';

import 'package:fa_prev/graphql/generated/anyupp-api.graphql.dart';
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
  Future<String> createAndSendOrderFromCart() async {
    print('AwsOrderProvider.createAndSendOrderFromCart()=${_cart?.id}');
    try {
      if (_cart == null || _cart?.id == null) {
        throw CartException(code: CartException.UNKNOWN_ERROR, message: 'Cart is null.');
      }

      var result = await GQL.backend.execute(CreateOrderFromCartMutation(
          variables: CreateOrderFromCartArguments(
        cartId: _cart!.id!,
      )));

      // print('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id;
      if (result.data != null && result.data?.createOrderFromCart != null) {
        id = result.data!.createOrderFromCart;
        print('AwsOrderProvider.createAndSendOrderFromCart().id=$id');
      }
      await clearCart();
      if (id == null) {
        throw CartException(code: CartException.UNKNOWN_ERROR, message: 'Generated order is null!');
      }
      return id;
    } on Exception catch (e) {
      print('AwsOrderProvider.createAndSendOrderFromCart.Exception: $e');
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
    _cart = await _getCartFromBackEnd(unitId);
    _cartController.add(_cart);
    return _cart;
  }

  @override
  Stream<Cart?> getCurrentCartStream(String unitId) async* {
    yield _cart;
    yield* _cartController.stream;
  }

  Future<Cart?> setPaymentMode(String unitId, PaymentMode mode) async {
    print('CartProvider.setPaymentMode()=$mode');
    Cart? _cart = await getCurrentCart(unitId);
    print('CartProvider.setPaymentMode().cart=${_cart?.id}');
    if (_cart != null) {
      _cart = _cart.copyWith(paymentMode: mode);
      await updateCart(unitId, _cart);
    }
    return _cart;
  }

  @override
  Future<void> updateCart(String unitId, Cart? cart) async {
    print('updateCart=${cart?.id}');
    bool delete = cart != null && cart.items.isEmpty;
    if (delete) {
      await _deleteCartFromBackend(cart.id!);
      _cart = null;
      _cartController.add(_cart);
      return;
    }

    bool newCart = _cart == null || _cart?.id == null;
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
    // print('CartProvider._getCartFromBackEnd().unit=$unitId, user=${user.id}');
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
        print('AwsOrderProvider._getCartFromBackEnd().error()=${result.errors}');
        throw GraphQLException.fromGraphQLError(GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      // print('AwsOrderProvider._getCartFromBackEnd().result()=$result');
      if (result.data == null || result.data?.listCarts == null) {
        return null;
      }

      var items = result.data?.listCarts?.items;
      // print('AwsOrderProvider._getCartFromBackEnd().items.length=${items?.length}');
      if (items != null && items.isNotEmpty) {
        // print('json[items] is List=${items[0]['items'] is List}');
        Cart cart = Cart.fromJson(items[0]!.toJson());
        // print('AwsOrderProvider._getCartFromBackEnd().cart=$cart');
        // print('AwsOrderProvider._getCartFromBackEnd().items=${cart.items}');
        return cart;
      }

      return null;
    } on Exception catch (e) {
      print('CartProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    // print('******** CREATING CART IN BACKEND');
    try {
      var result = await GQL.amplify.execute(CreateCartMutation(
        variables: CreateCartArguments(
          createCartInput: CreateCartInput.fromJson(
            _getCartMutationVariablesFromCart(cart),
          ),
        ),
      ));
      // print('******** CREATING CART IN BACKEND.result.data=${result.data}');
      // print('******** CREATING CART IN BACKEND.result.errors=${result.errors}');

      String? id = result.data?.createCart?.id;
      print('CartProvider._saveCartToBackend().id=$id');
      if (id != null && _cart != null) {
        _cart = _cart!.copyWith(id: id);
      }

      return !result.hasErrors;
    } on Exception catch (e) {
      print('CartProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    print('******** UPDATING CART IN BACKEND');
    try {
      var result = await GQL.amplify.execute(UpdateCartMutation(
          variables: UpdateCartArguments(
        updateCartInput: UpdateCartInput.fromJson(_getCartMutationVariablesFromCart(cart)),
      )));

      // print('******** UPDATING CART IN BACKEND.result.data=${result.data}');
      // print('******** UPDATING CART IN BACKEND.result.errors=${result.errors}');

      return !result.hasErrors;
    } on Exception catch (e) {
      print('CartProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String cartId) async {
    print('******** DELETING CART IN BACKEND=$cartId');
    try {
      var result = await GQL.amplify.execute(DeleteCartMutation(
        variables: DeleteCartArguments(cartId: cartId),
      ));

      return !result.hasErrors;
    } on Exception catch (e) {
      print('AwsOrderProvider._deleteCartFromBackend.Exception: $e');
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
      'items': cart.items.map((item) {
        return {
          'productId': item.productId,
          'variantId': item.variantId,
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
          'configSets': item.selectedConfigMap != null
              ? item.selectedConfigMap?.keys.toList().map((GeneratedProductConfigSet generatedProductConfigSet) {
                  return {
                    "name": {
                      'en': generatedProductConfigSet.name.en,
                      'de': generatedProductConfigSet.name.de,
                      'hu': generatedProductConfigSet.name.hu,
                    },
                    "productSetId": generatedProductConfigSet.productSetId,
                    "type": generatedProductConfigSet.type,
                    "items": item.selectedConfigMap != null
                        ? item.selectedConfigMap![generatedProductConfigSet]
                            ?.map((GeneratedProductConfigComponent generatedProductConfigComponent) {
                            return {
                              "allergens": generatedProductConfigComponent.allergens
                                  ?.map((e) => e.toString().split(".").last)
                                  .toList(),
                              "price": generatedProductConfigComponent.price,
                              "productComponentId": generatedProductConfigComponent.productComponentId,
                              "name": {
                                'en': generatedProductConfigComponent.name.en,
                                'de': generatedProductConfigComponent.name.de,
                                'hu': generatedProductConfigComponent.name.hu,
                              },
                            };
                          }).toList()
                        : null
                  };
                }).toList()
              : null,
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
