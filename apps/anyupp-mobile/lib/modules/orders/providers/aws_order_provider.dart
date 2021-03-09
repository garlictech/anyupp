import 'dart:convert';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/models/cart.dart';
import 'package:fa_prev/core/units/model/geo_unit.dart';
import 'package:fa_prev/shared/affiliate/utils/aws_dummy_utils.dart';
import 'package:fa_prev/shared/auth.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  final IAuthProvider _authProvider;

  // TODO AWS
  Cart _cart;

  AwsOrderProvider(this._authProvider);

  @override
  Future<void> clearCart(String chainId, String unitId) async {
    _cart = null;
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
      print('***** getCurrentOrders().data=$data');
      print('***** getCurrentOrders().errors=${response.errors}');
      if  (response.errors != null) {
        response.errors.forEach((element) {
          print('***** getCurrentOrders().error:${element.message}');
         });
      }
      Map<String, dynamic> json = jsonDecode(data);

      List<dynamic> items = json['listOrders']['items'];
      if (items == null || items.isEmpty) {
        yield null;
      }

      List<Order> orders = [];
      for (int i = 0; i < items.length; i++) {
        orders.add(Order.fromJson(Map<String, dynamic>.from(items[i])));
      }

      print('***** getCurrentOrders().orders=$orders');
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
  Stream<List<Order>> getOrderHistory(String chainId, String unitId) {
    // TODO AWS
    return AwsDummyUtils.list<Order>();
  }

  @override
  Future<void> updateCart(String chainId, String unitId, Cart cart) async {
    _cart = cart;
  }

  @override
  Future<void> userPaymentIntentionSignal(String chainId, String unitId) {
    // TODO: implement userPaymentIntentionSignal
    throw UnimplementedError();
  }
}
