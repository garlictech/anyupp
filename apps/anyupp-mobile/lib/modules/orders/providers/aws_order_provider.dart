import 'dart:async';

import '/core/core.dart';
import '/graphql/generated/crud-api.graphql.dart';
import '/graphql/graphql.dart';
import '/models.dart';
import '/modules/login/login.dart';
import '/shared/auth.dart';

import 'aws/aws_order_history_subscription_handler.dart';
import 'aws/aws_order_subscription_handler.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;

  AwsOrderSubscription? _subOrderList;
  AwsOrderHistorySubscription? _subOrderHistoryList;

  AwsOrderProvider(this._authProvider);

  @override
  Future<void> addInvoiceInfo(InvoiceInfo invoiceInfo) async {
    try {
      // await GQL.amplify.executeMutation(
      //   mutation: MUTATION_ADD_INVOICE_INFO,
      //   variables: {},
      // );
    } on Exception catch (e) {
      log.e('AwsOrderProvider.addInvoiceInfo().exception=$e');
      rethrow;
    }
  }

  @override
  Future<void> userPaymentIntentionSignal(String unitId) async {
    return;
  }

  @override
  Future<void> startOrderListSubscription(
    StreamController<List<Order>?> controller,
  ) async {
    log.d('startOrderListSubscription().controller=$controller');
    if (_subOrderList != null) {
      // log.d('startOrderListSubscription().stopping');
      await stopOrderListSubscription();
      // log.d('startOrderListSubscription().stopped');
    }
    User? user = await _authProvider.getAuthenticatedUserProfile();
    if (user == null) {
      throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.USER_NOT_LOGGED_IN,
        message: 'User not logged in. getAuthenticatedUserProfile() is null',
      );
    }
    _subOrderList = AwsOrderSubscription(
      userId: user.id,
    );
    await _subOrderList!.startListSubscription(
      controller: controller,
    );
    log.d('startOrderListSubscription().end()');
  }

  @override
  Future<void> stopOrderListSubscription() async {
    log.d('stopOrderListSubscription()');
    await _subOrderList?.stopListSubscription();
  }

  @override
  Future<void> startOrderHistoryListSubscription(
      StreamController<List<Order>?> controller) async {
    log.d('startOrderHistoryListSubscription()');
    if (_subOrderHistoryList != null) {
      await stopOrderHistoryListSubscription();
    }
    User? user = await _authProvider.getAuthenticatedUserProfile();
    _subOrderHistoryList = AwsOrderHistorySubscription(
      userId: user!.id,
    );
    return _subOrderHistoryList!.startListSubscription(
      controller: controller,
    );
  }

  @override
  Future<void> stopOrderHistoryListSubscription() async {
    log.d('stopOrderHistoryListSubscription()');
    await _subOrderHistoryList?.stopListSubscription();
  }

  @override
  Future<Order?> getOrder(String orderId) async {
    try {
      var result = await GQL.amplify.execute(GetOrderQuery(
        variables: GetOrderArguments(
          orderId: orderId,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data?.getOrder == null) {
        return null;
      }
      Order order = Order.fromJson(result.data!.getOrder!.toJson());
      return order;
    } on Exception catch (e) {
      log.e('AwsOrderProvider.getOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<List<Order>?> loadOrderHistoryNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  }) async {
    return _subOrderHistoryList?.loadNextPage(
      controller: controller,
      token: nextToken,
    );
  }

  @override
  Future<List<Order>?> loadOrdersNextPage({
    String? nextToken,
    required StreamController<List<Order>?> controller,
  }) async {
    return _subOrderList?.loadNextPage(
      controller: controller,
      token: nextToken,
    );
  }

  @override
  bool get orderHistoryListHasMoreItems =>
      _subOrderHistoryList?.hasMoreItems ?? false;

  @override
  int get orderHistoryListTotalCount => _subOrderHistoryList?.itemCount ?? 0;

  @override
  String? get orderHistoryListNextToken => _subOrderHistoryList?.nextToken;

  @override
  bool get orderListHasMoreItems => _subOrderList?.hasMoreItems ?? false;

  @override
  int get orderListTotalCount => _subOrderList?.itemCount ?? 0;

  @override
  String? get orderListNextToken => _subOrderList?.nextToken;

  @override
  Future<int> getActiveOrderCount(String unitId) async {
    try {
      User? user = await _authProvider.getAuthenticatedUserProfile();
      var result = await GQL.amplify.execute(SearchOrdersQuery(
          variables: SearchOrdersArguments(
        userId: user!.id,
      )));

      if (result.hasErrors || result.data == null) {
        return 0;
      }
      return result.data!.searchOrders?.total ?? 0;
    } on Exception catch (e) {
      log.e('getActiveOrderCount.Exception: $e');
      return 0;
    }
  }
}
