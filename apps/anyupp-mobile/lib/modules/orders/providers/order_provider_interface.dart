import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/orders/orders.dart';

abstract class IOrdersProvider {

  Future<Cart> getCurrentCart(String chainId, String unitId);

  Stream<Cart> getCurrentCartStream(String chainId, String unitId);

  Future<void> updateCart(String chainId, String unitId, Cart cart);

  Future<void> clearCart(String chainId, String unitId);

  Stream<List<PlacedOrder>> getCurrentOrders(String chainId, String unitId);

  Stream<List<PlacedOrder>> getOrderHistory(String chainId, String unitId);

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod);

  Future<void> userPaymentIntentionSignal(String chainId, String unitId);
}
