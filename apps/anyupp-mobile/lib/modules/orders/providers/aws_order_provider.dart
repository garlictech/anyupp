import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/graphql/queries/get_cart.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/providers/aws/aws_subscription_handler.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;

  StreamController<Cart> _cartController = BehaviorSubject<Cart>();
  Cart _cart;

  AwsSubscription<Order> _subOrderList;
  AwsSubscription<Order> _subOrderHistoryList;

  AwsOrderProvider(this._authProvider) {
    _subOrderList = AwsSubscription<Order>(
      authProvider: _authProvider,
      listQuery: QUERY_LIST_ACTIVE_ORDERS,
      listNodeName: 'listOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      filterModel: (model) =>
          model.status == OrderStatus.PLACED ||
          model.status == OrderStatus.PROCESSING ||
          model.status == OrderStatus.READY,
    );

    _subOrderHistoryList = AwsSubscription<Order>(
      authProvider: _authProvider,
      listQuery: QUERY_LIST_ORDER_HISTORY,
      listNodeName: 'listOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_HISTORY_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      filterModel: (model) => model.status == OrderStatus.PAID || model.status == OrderStatus.REJECTED,
    );
  }

  @override
  Future<void> clearCart(String chainId, String unitId) async {
    _cart = null;
    _cartController.add(null);
  }

  @override
  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
    // TODO: implement createAndSendOrderFromCart
    throw UnimplementedError();
  }

  @override
  Future<Cart> getCurrentCart(String chainId, String unitId) async {
    if (_cart == null) {
      _cart = await _getCartFromBackEnd(unitId);
      _cartController.add(_cart);
    }
    return _cart;
  }

  @override
  Stream<Cart> getCurrentCartStream(String chainId, String unitId) async* {
    yield _cart;
    yield* _cartController.stream;
  }

  @override
  Future<void> updateCart(String chainId, String unitId, Cart cart) async {
    print('updateCart=$cart');
    bool delete = cart != null && cart.items.isEmpty;
    if (delete) {
      await _deleteCartFromBackend(cart.id);
      _cart = null;
      _cartController.add(_cart);
      return;
    }

    bool newCart = _cart == null || _cart.id == null;
    if (newCart) {
      _cart = cart;
      await _saveCartToBackend(_cart);
    } else {
      _cart = cart;
      await _updateCartOnBckend(_cart);
    }
    _cartController.add(_cart);
  }

  Future<Cart> _getCartFromBackEnd(String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.query(QueryOptions(document: gql(QUERY_GET_CART), variables: {
        'userId': user.id,
        'unitId': unitId,
      }));

      print('AwsOrderProvider._getCartFromBackEnd().result()=$result');
      if (result.data == null) {
        return null;
      }

      List<dynamic> items = result.data['listCarts']['items'];
      print('AwsOrderProvider._getCartFromBackEnd().items=$items, length=${items?.length}');
      if (items != null && items.isNotEmpty) {
        Cart cart = Cart.fromJson(Map<String, dynamic>.from(items[0]));
        return cart;
      }

      return null;
    } on Exception catch (e) {
      print('AwsOrderProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    print('******** CREATING CART IN BACKEND=${cart.toJson()}');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_SAVE_CART),
          variables: {
            'createCartInput': {
              // 'id': cart.id == null ? UUID.getUUID() : cart.id,
              'unitId': cart.unitId,
              'userId': cart.userId,
              'items': cart.items.map((item) {
                return {
                  'productId': item.product.id,
                  'variantId': item.variant.id,
                  'created': 0, // TODO: DateTime.now().millisecondsSinceEpoch,  Variable 'created' has an invalid value. Expected type 'Int' but was 'Long'.
                  'productName': {
                    'en': item.product.name.en,
                    'de': item.product.name.de,
                    'hu': item.product.name.hu,
                  },
                  'priceShown': {
                    'currency': 'huf', 
                    'pricePerUnit': item.variant.price,
                    'priceSum': item.variant.price * item.quantity,
                    'tax': 0, // TODO
                    'taxSum': 0, // TODO
                  },
                  'quantity': item.quantity,
                  'variantName': {
                    'en': item.variant.variantName.en,
                    'de': item.variant.variantName.de, // TODO
                    'hu': item.variant.variantName.hu,
                  },
                };
              }).toList(),
              'paymentMode': cart.paymentMode != null
                  ? {
                      'name': cart.paymentMode.name,
                      'caption': cart.paymentMode.caption,
                      'method': cart.paymentMode.method,
                    }
                  : null,
              'takeAway': cart.takeAway,
              'place': cart.place,
            },
          },
        ),
      );
      print('AwsOrderProvider._saveCartToBackend().result.data=${result.data}');
      String id = result.data['createCart']['id'];
      print('AwsOrderProvider._saveCartToBackend().id=$id');

      _cart = _cart.copyWith(id: id);
      if (result.hasException) {
        print('AwsOrderProvider._saveCartToBackend().exception=${result.exception}');
        print('AwsOrderProvider._saveCartToBackend().source=${result.source}');
      }

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsOrderProvider._addFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBckend(Cart cart) async {
    print('******** UPDATING CART IN BACKEND');
    return true;
  }

  Future<bool> _deleteCartFromBackend(String cartId) async {
    print('******** DELETING CART IN BACKEND=$cartId');
    if (cartId == null) {
      return false;
    }
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_DELETE_CART),
          variables: {
            'cartId': cartId,
          },
        ),
      );

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsOrderProvider._deleteCartFromBackend.Exception: $e');
      rethrow;
    }
  }

  @override
  Stream<List<Order>> getCurrentOrders(String chainId, String unitId) => _subOrderList?.stream;

  @override
  Future<void> userPaymentIntentionSignal(String chainId, String unitId) {
    // TODO: implement userPaymentIntentionSignal
    throw UnimplementedError();
  }

  @override
  Future<void> startOrderListSubscription(String chainId, String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderList.startListSubscription(
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
    );
  }

  @override
  Future<void> stopOrderListSubscription() async {
    await _subOrderList.stopListSubscription();
  }

  @override
  Future<void> startOrderHistoryListSubscription(String chainId, String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderHistoryList.startListSubscription(
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
    );
  }

  @override
  Future<void> stopOrderHistoryListSubscription() async {
    await _subOrderHistoryList.stopListSubscription();
  }

  @override
  Stream<List<Order>> getOrderHistory(String chainId, String unitId) => _subOrderHistoryList.stream;
}
