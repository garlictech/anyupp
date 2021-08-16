import 'dart:async';

import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';

import 'aws/aws_order_history_subscription_handler.dart';
import 'aws/aws_order_subscription_handler.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;

  AwsOrderSubscription _subOrderList;
  AwsOrderHistorySubscription _subOrderHistoryList;

  AwsOrderProvider(this._authProvider);

  @override
  Future<void> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    try {
      // await GQL.backend.executeMutation(
      //   mutation: MUTATION_ADD_INVOICE_INFO,
      //   variables: {},
      // );
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
    print('startOrderListSubscription().controller=$controller');
    if (_subOrderList != null) {
      // print('startOrderListSubscription().stopping');
      await stopOrderListSubscription();
      // print('startOrderListSubscription().stopped');
    }
    User user = await _authProvider.getAuthenticatedUserProfile();
    _subOrderList = AwsOrderSubscription(
      unitId: unitId,
      userId: user.id,
    );
    await _subOrderList.startListSubscription(
      controller: controller,
    );
    print('startOrderListSubscription().end()');
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
    User user = await _authProvider.getAuthenticatedUserProfile();
    _subOrderHistoryList = AwsOrderHistorySubscription(
      unitId: unitId,
      userId: user.id,
    );
    return _subOrderHistoryList.startListSubscription(
      controller: controller,
    );
  }

  @override
  Future<void> stopOrderHistoryListSubscription() async {
    print('stopOrderHistoryListSubscription()');
    await _subOrderHistoryList?.stopListSubscription();
  }

  @override
  Future<Order> getOrder(String orderId) async {
    try {
      var result = await GQL.amplify.execute(GetOrderQuery(
        variables: GetOrderArguments(
          orderId: orderId,
        ),
      ));
      if (result.data == null) {
        return null;
      }
      Order order = Order.fromJson(result.data.getOrder.toJson());
      return order;
    } on Exception catch (e) {
      print('AwsOrderProvider.getOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<List<Order>> loadOrderHistoryNextPage({
    String nextToken,
    StreamController<List<Order>> controller,
  }) async {
    return _subOrderHistoryList.loadNextPage(
      controller: controller,
      token: nextToken,
    );
  }

  @override
  Future<List<Order>> loadOrdersNextPage({
    String nextToken,
    StreamController<List<Order>> controller,
  }) async {
    return _subOrderList.loadNextPage(
      controller: controller,
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
      var result = await GQL.amplify.execute(SearchOrdersQuery(
          variables: SearchOrdersArguments(
        userId: user.id,
        unitId: unitId,
      )));

      // QueryResult result = await GQL.amplify.executeQuery(
      //   query: QUERY_LIST_ACTIVE_ORDERS,
      //   variables: {
      //     'userId': user.id,
      //     'unitId': unitId,
      //   },
      //   //fetchPolicy: FetchPolicy.networkOnly,
      // );

      if (result == null || result.data == null) {
        return 0;
      }
      return result.data.searchOrders.total;

      // var items = result.data.searchOrders.items;
      // if (items == null || items.isEmpty) {
      //   return 0;
      // }

      // int totalCount = result.data.searchOrders.total;
      // print('***** getActiveOrderCount().count=$totalCount');
      // return totalCount;
    } on Exception catch (e) {
      print('getActiveOrderCount.Exception: $e');
      return 0;
    }
  }
}
