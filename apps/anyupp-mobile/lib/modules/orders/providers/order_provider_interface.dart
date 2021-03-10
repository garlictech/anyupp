import 'package:fa_prev/models.dart';

abstract class IOrdersProvider {

  Future<Cart> getCurrentCart(String chainId, String unitId);

  Stream<Cart> getCurrentCartStream(String chainId, String unitId);

  Future<void> updateCart(String chainId, String unitId, Cart cart);

  Future<void> clearCart(String chainId, String unitId);

  Stream<List<Order>> getCurrentOrders(String chainId, String unitId);

  Stream<List<Order>> getOrderHistory(String chainId, String unitId);

  Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod);

  Future<void> userPaymentIntentionSignal(String chainId, String unitId);
}
