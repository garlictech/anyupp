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
  Future<void> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId, UserInvoiceAddress invoiceAddress) {
    return _stripePaymentProvider.startStripePaymentWithExistingCard(cart, paymentMethodId, invoiceAddress);
  }

  @override
  Future<void> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, UserInvoiceAddress invoiceAddress, bool saveCard) {
    return _stripePaymentProvider.startStripePaymentWithNewCard(cart, stripeCard, invoiceAddress, saveCard);
  }

  @override
  Future<void> startExternalPayment(Cart cart, String paymentMethod, UserInvoiceAddress invoiceAddress) {
    return _externalPaymentProvider.startExternalPayment(cart, paymentMethod, invoiceAddress);
  }

  @override
  Future<void> startOrderStripePaymentWithExistingCard(String orderId, String paymentMethodId, UserInvoiceAddress invoiceAddress) {
       return _stripePaymentProvider.startOrderStripePaymentWithExistingCard(orderId, paymentMethodId, invoiceAddress);
    }
  
    @override
    Future<void> startOrderStripePaymentWithNewCard(String orderId, StripeCard stripeCard, UserInvoiceAddress invoiceAddress, bool saveCard) {
     return _stripePaymentProvider.startOrderStripePaymentWithNewCard(orderId, stripeCard, invoiceAddress, saveCard);
  }

  @override
  Future<void> startOrderExternalPayment(String orderId, String orderMethod, UserInvoiceAddress invoiceAddress) {
     return _externalPaymentProvider.startOrderExternalPayment(orderId, orderMethod, invoiceAddress);
  }
}
