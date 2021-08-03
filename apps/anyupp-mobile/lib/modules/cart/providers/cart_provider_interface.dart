import 'package:fa_prev/models.dart';

abstract class ICartProvider {
  Cart get cart;

  Future<Cart> getCurrentCart(String unitId);

  Stream<Cart> getCurrentCartStream(String unitId);

  Future<void> updateCart(String unitId, Cart cart);

  Future<void> clearCart();

  Future<Cart> setPaymentMode(String unitId, PaymentMode mode);

  Future<String> createAndSendOrderFromCart();
}
