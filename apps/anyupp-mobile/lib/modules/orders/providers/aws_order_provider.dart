import 'dart:async';

import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/providers/aws/aws_subscription_handler.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;
  final ValueNotifier<GraphQLClient> _client;

  StreamController<Cart> _cartController = BehaviorSubject<Cart>();
  Cart _cart;

  AwsSubscription<Order> _subOrderList;
  AwsSubscription<Order> _subOrderHistoryList;

  AwsOrderProvider(this._authProvider, this._client) {
    _subOrderList = AwsSubscription<Order>(
      authProvider: _authProvider,
      client: _client,
      listQuery: QUERY_LIST_ACTIVE_ORDERS,
      listNodeName: 'listOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      filterModel: (model) => model.status == OrderSatus.PLACED || model.status == OrderSatus.PROCESSING || model.status == OrderSatus.READY,
    );

    _subOrderHistoryList = AwsSubscription<Order>(
      authProvider: _authProvider,
      client: _client,
      listQuery: QUERY_LIST_ORDER_HISTORY,
      listNodeName: 'listOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_HISTORY_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      filterModel: (model) => model.status == OrderSatus.PAID || model.status == OrderSatus.REJECTED,
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
    return _cart;
  }

  @override
  Stream<Cart> getCurrentCartStream(String chainId, String unitId) async* {
    // TODO AWS
    yield _cart;
    yield* _cartController.stream;
  }

  @override
  Future<void> updateCart(String chainId, String unitId, Cart cart) async {
    _cart = cart;
    _cartController.add(_cart);
  }

  @override
  Stream<List<Order>> getCurrentOrders(String chainId, String unitId) => _subOrderList.stream;

  @override
  Future<void> userPaymentIntentionSignal(String chainId, String unitId) {
    // TODO: implement userPaymentIntentionSignal
    throw UnimplementedError();
  }

  @override
  Future<void> startOrderListSubscription(String chainId, String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderList.startListSubscription(variables: {
            'userId': user.id,
            'unitId': unitId,
          },);
  }

  @override
  Future<void> stopOrderListSubscription() async {
    await _subOrderList.stopListSubscription();
  }

  @override
  Future<void> startOrderHistoryListSubscription(String chainId, String unitId) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderHistoryList.startListSubscription(variables: {
            'userId': user.id,
            'unitId': unitId,
          },);
  }

  @override
  Future<void> stopOrderHistoryListSubscription() async {
    await _subOrderHistoryList.stopListSubscription();
  }

  @override
  Stream<List<Order>> getOrderHistory(String chainId, String unitId) => _subOrderHistoryList.stream;
}
