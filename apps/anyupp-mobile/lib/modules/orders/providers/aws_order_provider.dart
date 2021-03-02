import 'package:fa_prev/modules/orders/model/placed_order.dart';

import 'package:fa_prev/modules/cart/models/cart.dart';

import 'package:fa_prev/core/units/model/geo_unit.dart';

import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  
  @override
  Future<void> clearCart(String chainId, String unitId) {
      // TODO: implement clearCart
      throw UnimplementedError();
    }
  
    @override
    Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) {
      // TODO: implement createAndSendOrderFromCart
      throw UnimplementedError();
    }
  
    @override
    Future<Cart> getCurrentCart(String chainId, String unitId) {
      // TODO: implement getCurrentCart
      throw UnimplementedError();
    }
  
    @override
    Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
      // TODO: implement getCurrentCartStream
      throw UnimplementedError();
    }
  
    @override
    Stream<List<PlacedOrder>> getCurrentOrders(String chainId, String unitId) {
      // TODO: implement getCurrentOrders
      throw UnimplementedError();
    }
  
    @override
    Stream<List<PlacedOrder>> getOrderHistory(String chainId, String unitId) {
      // TODO: implement getOrderHistory
      throw UnimplementedError();
    }
  
    @override
    Future<void> updateCart(String chainId, String unitId, Cart cart) {
      // TODO: implement updateCart
      throw UnimplementedError();
    }
  
    @override
    Future<void> userPaymentIntentionSignal(String chainId, String unitId) {
    // TODO: implement userPaymentIntentionSignal
    throw UnimplementedError();
  }

}
