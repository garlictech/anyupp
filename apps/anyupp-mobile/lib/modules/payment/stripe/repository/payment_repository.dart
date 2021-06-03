import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/stripe/providers/external_payment_provider_interface.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

class StripePaymentRepository implements IStripePaymentProvider, IExternalPaymentProvider {
  final IStripePaymentProvider _stripePaymentProvider;
  final IExternalPaymentProvider _externalPaymentProvider;

  StripePaymentRepository(this._stripePaymentProvider, this._externalPaymentProvider);

  @override
  Future<List<StripePaymentMethod>> getPaymentMethods() {
    return _stripePaymentProvider.getPaymentMethods();
  }

  @override
  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card) {
    return _stripePaymentProvider.createPaymentMethodFromCard(secret, card);
  }

  @override
  Future<void> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId) {
    return _stripePaymentProvider.startStripePaymentWithExistingCard(cart, paymentMethodId);
  }

  @override
  Future<void> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard) {
    return _stripePaymentProvider.startStripePaymentWithNewCard(cart, stripeCard, saveCard);
  }

  @override
  Future<void> startExternalPayment(Cart cart, String paymentMethod) {
    return _externalPaymentProvider.startExternalPayment(cart, paymentMethod);
  }

  @override
  Future<void> startOrderStripePaymentWithExistingCard(String orderId, String paymentMethodId) {
       return _stripePaymentProvider.startOrderStripePaymentWithExistingCard(orderId, paymentMethodId);
    }
  
    @override
    Future<void> startOrderStripePaymentWithNewCard(String orderId, StripeCard stripeCard, bool saveCard) {
     return _stripePaymentProvider.startOrderStripePaymentWithNewCard(orderId, stripeCard, saveCard);
  }

  @override
  Future<void> startOrderExternalPayment(String orderId, String orderMethod) {
     return _externalPaymentProvider.startOrderExternalPayment(orderId, orderMethod);
  }
}
