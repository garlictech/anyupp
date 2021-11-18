import 'package:fa_prev/graphql/generated/crud-api.dart' as api;
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:stripe_sdk/stripe_sdk.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart' hide PaymentMethod;

import 'stripe_payment_provider_interface.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class GraphQLStripePaymentProvider implements IStripePaymentProvider {
  final Stripe _stripe;
  final ICartProvider _cartProvider;

  GraphQLStripePaymentProvider(this._stripe, this._cartProvider);

  @override
  Future<List<StripePaymentMethod>> getPaymentMethods() async {
    print('getPaymentMethods().start()');
    try {
      var result = await GQL.amplify.execute(
        api.ListStripePaymentMethodsQuery(),
      );

      var items = result.data?.listStripeCards;
      List<StripePaymentMethod> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          print('getPaymentMethods().card=${items[i]!.toJson()}');
          results.add(StripePaymentMethod.fromJson(items[i]!.toJson()));
        }
      }
      // results.add(createPaymentMethod(Map<String,dynamic>.from(card)));
      print('getPaymentMethods.results=${results.length}');
      return results;
    } catch (err) {
      print('err charging user: ${err.toString()}');
      return [];
    }
  }

  @override
  Future<void> startStripePaymentWithExistingCard(
      Cart cart, String paymentMethodId, UserInvoiceAddress? invoiceAddress) async {
    print('startStripePaymentWithExistingCard().start()=$cart');
    print('startStripePaymentWithExistingCard().invoiceAddress=$invoiceAddress');
    await _cartProvider.setPaymentMode(
        cart.unitId,
        PaymentMode(
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
          caption: 'stripe',
        ));

    String orderId = await _cartProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithExistingCard().orderId=$orderId');
    return startOrderStripePaymentWithExistingCard(orderId, paymentMethodId, invoiceAddress);
  }

  @override
  Future<void> startOrderStripePaymentWithExistingCard(
      String orderId, String paymentMethodId, UserInvoiceAddress? invoiceAddress) async {
    var result = await GQL.amplify.execute(api.StartPaymentMutation(
      variables: api.StartPaymentArguments(
        orderId: orderId,
        paymentMethod: api.PaymentMethod.inapp,
        paymentMethodId: paymentMethodId,
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress != null ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson()) : null,
      ),
    ));

    if (result.data == null || result.data?.startStripePayment == null) {
      return;
    }

    String? clientSecret = result.data!.startStripePayment?.clientSecret;
    print('startStripePaymentWithExistingCard.clientSecret=$clientSecret');
    if (clientSecret == null) {
      throw StripeException(code: StripeException.CODE, message: 'Client secret is null!');
    }

    print('startStripePaymentWithExistingCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await _stripe.confirmPayment(clientSecret, paymentMethodId: paymentMethodId);
    print('startStripePaymentWithExistingCard.confirmPayment().paymentResponse=$paymentResponse');
  }

  @override
  Future<void> startStripePaymentWithNewCard(
      Cart cart, StripeCard stripeCard, UserInvoiceAddress? invoiceAddress, bool saveCard) async {
    print('startStripePaymentWithNewCard().start()=$cart, $stripeCard');
    print('startStripePaymentWithNewCard().card.number=${stripeCard.number}');
    print('startStripePaymentWithExistingCard().invoiceAddress=$invoiceAddress');
    await _cartProvider.setPaymentMode(
        cart.unitId,
        PaymentMode(
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
          caption: 'stripe',
        ));

    String? orderId = await _cartProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithNewCard().orderId=$orderId');
    return startOrderStripePaymentWithNewCard(
      orderId,
      stripeCard,
      invoiceAddress,
      saveCard,
    );
  }

  @override
  Future<void> startOrderStripePaymentWithNewCard(
      String orderId, StripeCard stripeCard, UserInvoiceAddress? invoiceAddress, bool saveCard) async {
    Map<String, dynamic> paymentMethod = await _stripe.api.createPaymentMethodFromCard(stripeCard);
    String paymentMethodId = paymentMethod['id'];
    print('startStripePaymentWithNewCard().paymentMethodId=$paymentMethodId');

    var result = await GQL.amplify.execute(api.StartPaymentMutation(
      variables: api.StartPaymentArguments(
        orderId: orderId,
        paymentMethod: api.PaymentMethod.inapp,
        paymentMethodId: paymentMethodId,
        savePaymentMethod: saveCard,
        invoiceAddress: invoiceAddress != null ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson()) : null,
      ),
    ));

    if (result.hasErrors) {
      throw GraphQLException.fromGraphQLError(GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
    }

    String? clientSecret = result.data!.startStripePayment?.clientSecret;
    print('startStripePaymentWithNewCard.clientSecret=$clientSecret');
    if (clientSecret == null) {
      throw StripeException(code: StripeException.CODE, message: 'Client secret is null!');
    }

    print('startStripePaymentWithNewCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await _stripe.confirmPayment(clientSecret);
    print('startStripePaymentWithNewCard.confirmPayment().paymentResponse=$paymentResponse');
  }

  @override
  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card) async {
    print('createPaymentMethodFromCard().start()');
    try {
      // _stripe.api.createPaymentMethodFromCard();
      final paymentMethod = await _stripe.api.createPaymentMethodFromCard(card);
      print('createPaymentMethodFromCard().paymentMethod=$paymentMethod');
      return false;
    } on Exception catch (e) {
      throw StripeException.fromException(StripeException.UNKNOWN_ERROR, e);
    }
  }

  Future<Map<String, dynamic>?> confirmPayment3DSecure(String clientSecret, String paymentMethodId) async {
    try {
      await _stripe.confirmPayment(clientSecret, paymentMethodId: paymentMethodId);
      final paymentIntentRes3dSecure = await _stripe.api.retrievePaymentIntent(clientSecret);
      return paymentIntentRes3dSecure;
    } catch (e) {
      return null;
    }
  }

  @override
  Future<StripePaymentMethod> createStripeCard(StripeCard card, String? name) async {
    try {
      var result = await GQL.amplify.execute(api.CreateStripeCardMutation(
        variables: api.CreateStripeCardArguments(
          card: api.StripeCardCreateInput(
            cardNumber: card.number!,
            expYear: card.expYear!,
            expMonth: card.expMonth!,
            cvc: card.cvc!,
            defaultForCurrency: false,
            name: name ?? '',
          ),
        ),
      ));
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(StripeException.CODE, result.errors);
      }

      return StripePaymentMethod.fromJson(result.data!.createStripeCard!.toJson());
    } on Exception catch (e) {
      print('createStripeCard().exception=$e');
      rethrow;
    }
  }

  @override
  Future<bool> deleteStripeCard(String cardId) async {
    try {
      var result = await GQL.amplify.execute(api.DeleteStripeCardMutation(
        variables: api.DeleteStripeCardArguments(
          paymentMethodId: cardId,
        ),
      ));
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(StripeException.CODE, result.errors);
      }

      return !result.hasErrors;
    } on Exception catch (e) {
      print('deleteStripeCard().exception=$e');
      rethrow;
    }
  }

  @override
  Future<StripePaymentMethod> updateStripeCard(String cardId, String name) async {
    try {
      var result = await GQL.amplify.execute(api.UpdateStripeCardMutation(
        variables: api.UpdateStripeCardArguments(
          paymentMethodId: cardId,
          name: name,
        ),
      ));
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(StripeException.CODE, result.errors);
      }
      return StripePaymentMethod.fromJson(result.data!.updateMyStripeCard!.toJson());
    } on Exception catch (e) {
      print('updateStripeCard().exception=$e');
      rethrow;
    }
  }
}
