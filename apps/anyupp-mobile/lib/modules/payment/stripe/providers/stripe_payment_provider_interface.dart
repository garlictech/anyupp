import 'package:fa_prev/models.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

abstract class IStripePaymentProvider {

  Future<List<StripePaymentMethod>> getPaymentMethods();

  Future<String> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId);

  Future<String> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard);

  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card);

  // TODO majd megcsinalni ezt is
  // Stream<List<StripePayment>> getPaymentHistory();
}
