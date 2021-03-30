import 'package:fa_prev/graphql/graphql.dart';
import 'package:stripe_sdk/src/models/card.dart';

abstract class IStripePaymentProvider {

  Future<List<StripeCard>> getPaymentMethods();

  Future<String> startStripePaymentWithExistingCard(String chainId, String unitId, String userId, String paymentMethodId);

  Future<String> startStripePaymentWithNewCard(String chainId, String unitId, String userId, StripeCard stripeCard, bool saveCard);

  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card);

  // TODO majd megcsinalni ezt is
  // Stream<List<StripePayment>> getPaymentHistory();
}
