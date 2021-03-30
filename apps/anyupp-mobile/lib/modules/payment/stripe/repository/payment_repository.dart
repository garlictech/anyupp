import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripePaymentRepository implements IStripePaymentProvider {

  final IStripePaymentProvider _paymentProvider;

  StripePaymentRepository(this._paymentProvider);

  @override
  Future<List<StripeCard>> getPaymentMethods() {
    return _paymentProvider.getPaymentMethods();
  }

  @override
  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card) {
    return _paymentProvider.createPaymentMethodFromCard(secret, card);
  }

  @override
  Future<String> startStripePaymentWithExistingCard(String chainId, String unitId, String userId, String paymentMethodId) {
    return _paymentProvider.startStripePaymentWithExistingCard(chainId, unitId, userId, paymentMethodId);
  }

  @override
  Future<String> startStripePaymentWithNewCard(String chainId, String unitId, String userId, StripeCard stripeCard, bool saveCard) {
    return _paymentProvider.startStripePaymentWithNewCard(chainId, unitId, userId, stripeCard, saveCard);
  }
}
