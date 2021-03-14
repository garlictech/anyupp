import 'dart:async';
import 'dart:convert';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';
import 'order_provider_interface.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;
  final ValueNotifier<GraphQLClient> _client;

  StreamController<Cart> _cartController = BehaviorSubject<Cart>();
  Cart _cart;

  GraphQLSubscriptionOperation _orderListSubscription;
  StreamSubscription<QueryResult> _orderListSubscription2;

  AwsOrderProvider(this._authProvider, this._client);

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
  Stream<List<Order>> getCurrentOrders(String chainId, String unitId) async* {
    print('getCurrentOrders().unitId=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      print('getCurrentOrders().userId=${user.id}');
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: QUERY_LIST_ACTIVE_ORDERS,
          variables: {
            'userId': user.id,
            'unitId': unitId,
          },
        ),
      );

      var response = await operation.response;
      var data = response.data;
      // print('***** getCurrentOrders().data=$data');
      // print('***** getCurrentOrders().errors=${response.errors}');
      // if (response.errors != null) {
      //   response.errors.forEach((element) {
      //     print('***** getCurrentOrders().error:${element.message}');
      //   });
      // }
      Map<String, dynamic> json = jsonDecode(data);
      // print('***** getCurrentOrders().json=$json');

      List<dynamic> items = json['listOrders']['items'];
      // print('***** getCurrentOrders().items=$items');
      if (items == null || items.isEmpty) {
        yield null;
      }

      List<Order> orders = [];
      for (int i = 0; i < items.length; i++) {
        orders.add(Order.fromJson(Map<String, dynamic>.from(items[i])));
      }

      // print('***** getCurrentOrders().orders=$orders');
      yield orders;
    } on ApiException catch (e) {
      print('getCurrentOrders.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('getCurrentOrders.Exception: $e');
      rethrow;
    }
  }

  @override
  Stream<List<Order>> getOrderHistory(String chainId, String unitId) async* {
    print('getOrderHistory().unitId=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      print('getOrderHistory().userId=${user.id}');
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: QUERY_LIST_ORDER_HISTORY,
          variables: {
            'userId': user.id,
            'unitId': unitId,
          },
        ),
      );

      var response = await operation.response;
      var data = response.data;
      Map<String, dynamic> json = jsonDecode(data);
      List<dynamic> items = json['listOrders']['items'];
      if (items == null || items.isEmpty) {
        yield null;
      }

      List<Order> orders = [];
      for (int i = 0; i < items.length; i++) {
        orders.add(Order.fromJson(Map<String, dynamic>.from(items[i])));
      }

      yield orders;
    } on ApiException catch (e) {
      print('getOrderHistory.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('getOrderHistory.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<void> userPaymentIntentionSignal(String chainId, String unitId) {
    // TODO: implement userPaymentIntentionSignal
    throw UnimplementedError();
  }

  @override
  Future<void> startOrderListSubscription(String chainId, String unitId) async {
    print('**** startOrderListSubscription().chainId=$chainId, unitId=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      print('**** startOrderListSubscription().userId=${user.id}');
      _orderListSubscription2 = _client.value.subscribe(
        SubscriptionOptions(
          document: gql(SUBSCRIPTION_ORDER_LIST),
          variables: {
            'userId': user.id,
            'unitId': unitId,
          },
        ),
      ).listen(
      (QueryResult result) {
        print('**** startOrderListSubscription().onData=$result');
      }, 
      onDone: () {
        print('**** startOrderListSubscription().onDone');
      },
      onError: (error) {
        print('**** startOrderListSubscription().onError=$error');

      },
      cancelOnError: false
      );
    } on Exception catch (e) {
      print('startOrderListSubscription.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<void> startOrderListSubscription2(String chainId, String unitId) async {
    print('**** startOrderListSubscription().chainId=$chainId, unitId=$unitId');
    if (_orderListSubscription != null) {
      throw ApiException('startOrderListSubscription._orderListSubscription already initialized!');
    }

    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      print('**** startOrderListSubscription().userId=${user.id}');
      _orderListSubscription = Amplify.API.subscribe(
        request: GraphQLRequest<String>(
          document: SUBSCRIPTION_ORDER_LIST,
          variables: {
            'userId': user.id,
            'unitId': unitId,
          },
        ),
        onData: (GraphQLResponse response) {
          print('**** startOrderListSubscription().onData=$response');
          // Order order = Order.fromJson(Map<String, dynamic>.from(jsonDecode(response.data)['onOrderChanged']));
          // print('**** startOrderListSubscription().order=$order');
        },
        onEstablished: () {
          print('**** startOrderListSubscription().Subscription established');
        },
        onError: (e) {
          print('**** startOrderListSubscription().Subscription failed with error: $e');
        },
        onDone: () {
          print('**** startOrderListSubscription().Subscription has been closed successfully');
        },
      );
    } on ApiException catch (e) {
      print('startOrderListSubscription.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('startOrderListSubscription.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<void> stopOrderListSubscription() async {
    print('**** stopOrderListSubscription()');
    if (_orderListSubscription != null) {
      _orderListSubscription.cancel();
    }
    if (_orderListSubscription2 != null) {
      await _orderListSubscription2.cancel();
    }
    return;
  }

  @override
  Future<void> startOrderHistoryListSubscription(String chainId, String unitId) {
    // TODO: implement startOrderHistoryListSubscription
    throw UnimplementedError();
  }

  @override
  Future<void> stopOrderHistoryListSubscription() {
    // TODO: implement stopOrderHistoryListSubscription
    throw UnimplementedError();
  }
}
