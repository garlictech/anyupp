import 'dart:async';

import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'aws/aws_subscription_handler.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;

  AwsSubscription<Order> _subOrderList;
  AwsSubscription<Order> _subOrderHistoryList;

  AwsOrderProvider(this._authProvider);

  @override
  Future<void> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    try {
      await GQL.backend.executeMutation(
        mutation: MUTATION_ADD_INVOICE_INFO,
        variables: {},
      );
    } on Exception catch (e) {
      print('AwsOrderProvider.addInvoiceInfo().exception=$e');
      rethrow;
    }
  }

  @override
  Future<void> userPaymentIntentionSignal(String unitId) async {
    return;
  }

  @override
  Future<void> startOrderListSubscription(
    String unitId,
    StreamController<List<Order>> controller,
  ) async {
    // print('startOrderListSubscription().controller=$controller');
    if (_subOrderList != null) {
      // print('startOrderListSubscription().stopping');
      await stopOrderListSubscription();
      // print('startOrderListSubscription().stopped');
    }
    _subOrderList = AwsSubscription<Order>(
      name: 'ORDERS',
      listQuery: QUERY_LIST_ACTIVE_ORDERS,
      listNodeName: 'searchOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      sortItems: (items) => items.sort((a, b) => b.orderNum.compareTo(a.orderNum)),
      filterModel: (model) => !model.archived,
    );
    User user = await _authProvider.getAuthenticatedUserProfile();
    await _subOrderList.startListSubscription(
      controller: controller,
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
    );
    // print('startOrderListSubscription().end()');
  }

  @override
  Future<void> stopOrderListSubscription() async {
    print('stopOrderListSubscription()');
    await _subOrderList?.stopListSubscription();
  }

  @override
  Future<void> startOrderHistoryListSubscription(String unitId, StreamController<List<Order>> controller) async {
    print('startOrderHistoryListSubscription()');
    if (_subOrderHistoryList != null) {
      await stopOrderHistoryListSubscription();
    }
    _subOrderHistoryList = AwsSubscription<Order>(
      name: 'HISTORY',
      listQuery: QUERY_LIST_ORDER_HISTORY,
      listNodeName: 'searchOrders',
      subscriptionQuery: SUBSCRIPTION_ORDER_HISTORY_LIST,
      subscriptionNodeName: 'onOrderChanged',
      modelFromJson: (json) => Order.fromJson(json),
      sortItems: (items) => items.sort((a, b) => b.orderNum.compareTo(a.orderNum)),
      filterModel: (model) => model.archived,
    );
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderHistoryList.startListSubscription(
      controller: controller,
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
    );
  }

  @override
  Future<void> stopOrderHistoryListSubscription() async {
    print('stopOrderHistoryListSubscription()');
    await _subOrderHistoryList?.stopListSubscription();
  }

  // @override
  // Stream<List<Order>> getOrderHistory(String unitId) => _subOrderHistoryList?.stream;

  @override
  Future<Order> getOrder(String orderId) async {
    try {
      QueryResult result = await GQL.amplify.executeQuery(
        query: QUERY_GET_ORDER,
        variables: {
          'orderId': orderId,
        },
        fetchPolicy: FetchPolicy.networkOnly,
      );

      // print('AwsOrderProvider.getOrder().result()=$result');
      if (result.data == null) {
        return null;
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

  @override
  Future<List<Order>> loadOrderHistoryNextPage({
    String unitId,
    String nextToken,
    StreamController<List<Order>> controller,
  }) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderHistoryList.loadNextPage(
      controller: controller,
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
      token: nextToken,
    );
  }

  @override
  Future<List<Order>> loadOrdersNextPage({
    String unitId,
    String nextToken,
    StreamController<List<Order>> controller,
  }) async {
    User user = await _authProvider.getAuthenticatedUserProfile();
    return _subOrderList.loadNextPage(
      controller: controller,
      variables: {
        'userId': user.id,
        'unitId': unitId,
      },
      token: nextToken,
    );
  }

  @override
  bool get orderHistoryListHasMoreItems => _subOrderHistoryList.hasMoreItems;

  @override
  int get orderHistoryListTotalCount => _subOrderHistoryList.itemCount;

  @override
  String get orderHistoryListNextToken => _subOrderHistoryList.nextToken;

  @override
  bool get orderListHasMoreItems => _subOrderList.hasMoreItems;

  @override
  int get orderListTotalCount => _subOrderList.itemCount;

  @override
  String get orderListNextToken => _subOrderList.nextToken;

  @override
  Future<int> getActiveOrderCount(String unitId) async {
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      QueryResult result = await GQL.amplify.executeQuery(
        query: QUERY_LIST_ACTIVE_ORDERS,
        variables: {
          'userId': user.id,
          'unitId': unitId,
        },
        //fetchPolicy: FetchPolicy.networkOnly,
      );

      if (result == null || result.data == null) {
        return 0;
      }

      List<dynamic> items = result.data['searchOrders']['items'];
      if (items == null || items.isEmpty) {
        return 0;
      }

      int totalCount = result.data['searchOrders']['total'];

      print('***** getActiveOrderCount().count=$totalCount');
      return totalCount;
    } on Exception catch (e) {
      print('getActiveOrderCount.Exception: $e');
      return 0;
    }
  }
}
