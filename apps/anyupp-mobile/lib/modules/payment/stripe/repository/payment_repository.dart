import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripePaymentRepository implements IStripePaymentProvider {

  final IStripePaymentProvider _paymentProvider;

  StripePaymentRepository(this._paymentProvider);

  @override
  Future<List<StripePaymentMethod>> getPaymentMethods() {
    return _paymentProvider.getPaymentMethods();
  }

  @override
  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card) {
    return _paymentProvider.createPaymentMethodFromCard(secret, card);
  }

  @override
  Future<String> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId) {
    return _paymentProvider.startStripePaymentWithExistingCard(cart, paymentMethodId);
  }

  @override
  Future<String> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard) {
    return _paymentProvider.startStripePaymentWithNewCard(cart, stripeCard, saveCard);
  }
}
