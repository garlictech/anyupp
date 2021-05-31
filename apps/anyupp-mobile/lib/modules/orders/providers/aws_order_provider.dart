import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/graphql/mutations/add_invoice_info.dart';
import 'package:fa_prev/graphql/queries/get_cart.dart';
import 'package:fa_prev/graphql/queries/get_order.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/InvoiceInfo.dart';
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
      // filterModel: (model) =>
      //     model.status == OrderStatus.placed ||
      //     model.status == OrderStatus.processing ||
      //     model.status == OrderStatus.ready,
    );

    _subOrderHistoryList = AwsSubscription<Order>(
      authProvider: _authProvider,
      listQuery: QUERY_LIST_ORDER_HISTORY,
      listNodeName: 'listOrderHistorys',
      subscriptionQuery: SUBSCRIPTION_ORDER_HISTORY_LIST,
      subscriptionNodeName: 'onOrderChanged', // TODO EZ MAS LESZ, CSAK NINCS KÉSZ!!!!
      modelFromJson: (json) => Order.fromJson(json),
      // filterModel: (model) => model.status == OrderStatus.PAID || model.status == OrderStatus.REJECTED,
    );
  }

  Cart get cart => _cart; 

  @override
  Future<void> clearCart(String chainId, String unitId) async {
    if (_cart != null && _cart.id != null) {
      await _deleteCartFromBackend(_cart.id);
    }
    _cart = null;
    _cartController.add(null);
  }

  @override
  Future<String> createAndSendOrderFromCart() async {
    print('AwsOrderProvider.createAndSendOrderFromCart()=${_cart?.id}');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(document: gql(MUTATION_CREATE_ORDER_FROM_CART), variables: {
          'cartId': _cart.id,
        }),
      );
      if (result.hasException) {
        print('AwsOrderProvider.createAndSendOrderFromCart().exception=${result.exception}');
        // TODO AWS!!!!
        // throw Exception(result.exception);
        _cart = null;
        _cartController.add(null);
        return null;
      }

      print('AwsOrderProvider.createAndSendOrderFromCart().result.data=${result.data}');
      String id;
      if (result.data != null && result.data['createOrderFromCart'] != null) {
        id = result.data['createOrderFromCart'];
        print('AwsOrderProvider.createAndSendOrderFromCart().id=$id');
      }
      _cart = null;
      _cartController.add(null);
      return id;
    } on Exception catch (e) {
      print('AwsOrderProvider.createAndSendOrderFromCart.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(document: gql(MUTATION_ADD_INVOICE_INFO), variables: {}),
      );
      if (result.hasException) {
        print('AwsOrderProvider.addInvoiceInfo().exception=${result.exception}');
        return Future.value(false);
      }
      return Future.value(true);
    } on Exception catch (e) {
      print('AwsOrderProvider.addInvoiceInfo().exception=$e');
      rethrow;
    }
  }

  @override
  Future<Cart> getCurrentCart(String chainId, String unitId) async {
    // if (_cart == null) {
    //   _cart = await _getCartFromBackEnd(unitId);
    //   _cartController.add(_cart);
    // }
    // return _cart;
    _cart = await _getCartFromBackEnd(unitId);
    _cartController.add(_cart);
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
      await _updateCartOnBackend(_cart);
    }
    _cartController.add(_cart);
  }

  Future<Cart> _getCartFromBackEnd(String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    print('AwsOrderProvider._getCartFromBackEnd().unit=$unitId, user=${user?.id}');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_GET_CART),
        variables: {
          'userId': user.id,
          'unitId': unitId,
        },
        fetchPolicy: FetchPolicy.networkOnly,
      ));

      print('AwsOrderProvider._getCartFromBackEnd().result()=$result');
      if (result.data == null) {
        return null;
      }
      if (result.hasException) {
        throw GraphQLException(
          message: result.exception.toString(),
        );
      }

      List<dynamic> items = result.data['listCarts']['items'];
      print('AwsOrderProvider._getCartFromBackEnd().items.length=${items?.length}');
      if (items != null && items.isNotEmpty) {
        print('json[items] is List=${items[0]['items'] is List}');
        Cart cart = Cart.fromJson(Map<String, dynamic>.from(items[0]));
        print('AwsOrderProvider._getCartFromBackEnd().cart=$cart');
        print('AwsOrderProvider._getCartFromBackEnd().items=${cart.items}');
        return cart;
      }

      return null;
    } on Exception catch (e) {
      print('AwsOrderProvider._getCartFromBackEnd.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _saveCartToBackend(Cart cart) async {
    print('******** CREATING CART IN BACKEND');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_SAVE_CART),
          variables: _getCartMutationVariablesFromCart(cart, 'createCartInput'),
        ),
      );
      print('AwsOrderProvider._saveCartToBackend().result.data=${result.data}');
      if (result.hasException) {
        print('AwsOrderProvider._saveCartToBackend().exception=${result.exception}');
        print('AwsOrderProvider._saveCartToBackend().source=${result.source}');
        throw result.exception;
      }

      String id = result.data['createCart']['id'];
      print('AwsOrderProvider._saveCartToBackend().id=$id');

      _cart = _cart.copyWith(id: id);

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsOrderProvider._saveCartToBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _updateCartOnBackend(Cart cart) async {
    print('******** UPDATING CART IN BACKEND');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_UPDATE_CART),
          variables: _getCartMutationVariablesFromCart(cart, 'updateCartInput'),
        ),
      );
      print('AwsOrderProvider._updateCartOnBackend().result.data=${result.data}');
      if (result.hasException) {
        print('AwsOrderProvider._updateCartOnBackend().exception=${result.exception}');
        print('AwsOrderProvider._updateCartOnBackend().source=${result.source}');
      }

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsOrderProvider._updateCartOnBackend.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteCartFromBackend(String cartId) async {
    print('******** DELETING CART IN BACKEND=$cartId');
    if (cartId == null) {
      return false;
    }
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
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
    print('stopOrderListSubscription()');
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
    print('stopOrderHistoryListSubscription()');
    await _subOrderHistoryList.stopListSubscription();
  }

  @override
  Stream<List<Order>> getOrderHistory(String chainId, String unitId) => _subOrderHistoryList.stream;

  @override
  Future<Order> getOrder(String orderId) async {
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_GET_ORDER),
        variables: {
          'orderId': orderId,
        },
        fetchPolicy: FetchPolicy.networkOnly,
      ));

      print('AwsOrderProvider.getOrder().result()=$result');
      if (result.data == null) {
        return null;
      }
      if (result.hasException) {
        throw GraphQLException(
          message: result.exception.toString(),
        );
      }

      dynamic item = result.data['getOrder'];
      if (item != null) {
        Order order = Order.fromJson(Map<String, dynamic>.from(item));
        print('AwsOrderProvider.getOrder()=$order');
        return order;
      }

      return null;
    } on Exception catch (e) {
      print('AwsOrderProvider.getOrder.Exception: $e');
      rethrow;
    }
  }

  Map<String, dynamic> _getCartMutationVariablesFromCart(Cart cart, String name) {
    return {
      '$name': {
        if (cart.id != null) 'id': cart.id,
        'unitId': cart.unitId,
        'userId': cart.userId,
        'items': cart.items.map((item) {
          return {
            'productId': item.productId,
            'variantId': item.variantId,
            'created':
                1, // TODO: DateTime.now().millisecondsSinceEpoch,  Variable 'created' has an invalid value. Expected type 'Int' but was 'Long'.
            'productName': {
              'en': item.productName.en,
              'de': item.productName.de,
              'hu': item.productName.hu,
            },
            'priceShown': {
              'currency': item.priceShown.currency,
              'pricePerUnit': item.priceShown.pricePerUnit,
              'priceSum': item.priceShown.priceSum,
              'tax': item.priceShown.tax, // TODO
              'taxSum': item.priceShown.taxSum, // TODO
            },
            'statusLog': {
              'userId': cart.userId,
              'status': 'none',
              'ts': 1.0,
            },
            "allergens": item.allergens,
            'quantity': item.quantity,
            'variantName': {
              'en': item.variantName.en,
              'de': item.variantName.de,
              'hu': item.variantName.hu,
            },
            'configSets': item.selectedConfigMap != null
                ? item.selectedConfigMap.keys.toList().map((GeneratedProductConfigSet generatedProductConfigSet) {
                    return {
                      "name": {
                        'en': generatedProductConfigSet.name.en,
                        'de': generatedProductConfigSet.name.de,
                        'hu': generatedProductConfigSet.name.hu,
                      },
                      "productSetId": generatedProductConfigSet.productSetId,
                      "type": generatedProductConfigSet.type,
                      "items": item.selectedConfigMap != null
                          ? item.selectedConfigMap[generatedProductConfigSet]
                              .map((GeneratedProductConfigComponent generatedProductConfigComponent) {
                              return {
                                "allergens": generatedProductConfigComponent.allergens
                                    .map((e) => e.toString().split(".").last)
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
                'type': cart.paymentMode.type,
                'caption': cart.paymentMode.caption,
                'method': cart.paymentMode.method,
              }
            : null,
        'takeAway': cart.takeAway,
        'place': cart.place != null
            ? {
                'table': cart.place.table,
                'seat': cart.place.seat,
              }
            : null,
      },
    };
  }
}
