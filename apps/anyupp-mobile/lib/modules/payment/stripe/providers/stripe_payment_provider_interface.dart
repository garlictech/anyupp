import 'package:fa_prev/models.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

abstract class IStripePaymentProvider {
  Future<List<StripePaymentMethod>> getPaymentMethods();

  Future<void> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId);

  Future<void> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard);

  Future<void> startOrderStripePaymentWithExistingCard(String orderId, String paymentMethodId);

  Future<void> startOrderStripePaymentWithNewCard(String orderId, StripeCard stripeCard, bool saveCard);

  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card);
}
