import '/models.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

abstract class IStripePaymentProvider {
  Future<List<StripePaymentMethod>> getPaymentMethods();

  Future<void> startStripePaymentWithExistingCard(
      Cart cart, String paymentMethodId, UserInvoiceAddress? invoiceAddress);

  Future<void> startStripePaymentWithNewCard(
      Cart cart, StripeCard stripeCard, UserInvoiceAddress? invoiceAddress, bool saveCard);

  Future<void> startOrderStripePaymentWithExistingCard(
      String orderId, String paymentMethodId, UserInvoiceAddress? invoiceAddress);

  Future<void> startOrderStripePaymentWithNewCard(
      String orderId, StripeCard stripeCard, UserInvoiceAddress? invoiceAddress, bool saveCard);

  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card);

  Future<StripePaymentMethod> createStripeCard(StripeCard card, String name);

  Future<StripePaymentMethod> updateStripeCard(String cardId, String name);

  Future<bool> deleteStripeCard(String cardId);
}
