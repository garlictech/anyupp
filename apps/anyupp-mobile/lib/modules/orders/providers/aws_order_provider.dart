import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/models/cart.dart';
import 'package:fa_prev/core/units/model/geo_unit.dart';
import 'package:fa_prev/shared/affiliate/utils/aws_dummy_utils.dart';
import 'order_provider_interface.dart';

class AwsOrderProvider implements IOrdersProvider {
  // TODO AWS
  Cart _cart;

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
  Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
    // TODO AWS
    return AwsDummyUtils.single(_cart);
  }

  @override
  Stream<List<Order>> getCurrentOrders(String chainId, String unitId) {
    // TODO AWS
    return AwsDummyUtils.list<Order>();
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
