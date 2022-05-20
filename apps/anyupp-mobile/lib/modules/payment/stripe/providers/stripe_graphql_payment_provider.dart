import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart' as api;
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:stripe_sdk/stripe_sdk.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart' hide PaymentMethod;

class GraphQLStripePaymentProvider implements IStripePaymentProvider {
  final Stripe _stripe;
  final ICartProvider _cartProvider;

  GraphQLStripePaymentProvider(this._stripe, this._cartProvider);

  @override
  Future<List<StripePaymentMethod>> getPaymentMethods() async {
    log.d('getPaymentMethods().start()');
    try {
      var result = await GQL.amplify.execute(
        api.ListStripePaymentMethodsQuery(),
      );

      var items = result.data?.listStripeCards;
      List<StripePaymentMethod> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          log.d('getPaymentMethods().card=${items[i]!.toJson()}');
          results.add(StripePaymentMethod.fromJson(items[i]!.toJson()));
        }
      }
      // results.add(createPaymentMethod(Map<String,dynamic>.from(card)));
      log.d('getPaymentMethods.results=${results.length}');
      return results;
    } catch (err) {
      log.e('err charging user: ${err.toString()}');
      return [];
    }
  }

  @override
  Future<void> startStripePaymentWithExistingCard(Cart cart,
      String paymentMethodId, UserInvoiceAddress? invoiceAddress) async {
    log.d('startStripePaymentWithExistingCard().start()=$cart');
    log.d(
        'startStripePaymentWithExistingCard().invoiceAddress=$invoiceAddress');
    await _cartProvider.setPaymentMode(
        cart.unitId,
        PaymentMode(
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
          caption: 'stripe',
        ));

    String orderId = await _cartProvider.createAndSendOrderFromCart();
    log.d('startStripePaymentWithExistingCard().orderId=$orderId');
    return startOrderStripePaymentWithExistingCard(
        orderId, paymentMethodId, invoiceAddress);
  }

  @override
  Future<void> startOrderStripePaymentWithExistingCard(String orderId,
      String paymentMethodId, UserInvoiceAddress? invoiceAddress) async {
    var result = await GQL.amplify.execute(api.StartPaymentMutation(
      variables: api.StartPaymentArguments(
        orderId: orderId,
        paymentMethod: api.PaymentMethod.inapp,
        paymentMethodId: paymentMethodId,
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress != null
            ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson())
            : null,
      ),
    ));

    if (result.hasErrors) {
      log.d('startStripePaymentWithExistingCard.error=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
    }

    String? clientSecret = result.data?.startStripePayment?.clientSecret;
    String? merchantPaymentMethodId =
        result.data?.startStripePayment?.paymentMethodId;
    String? stripeAccount = result.data?.startStripePayment?.stripeAccount;
    if (clientSecret == null) {
      throw StripeException(
          code: StripeException.CODE, message: 'Client secret is null!');
    }

    Stripe stripe = Stripe(
      AppConfig.StripePublishableKey,
      returnUrlForSca: 'anyupp://stripe',
      stripeAccount: stripeAccount,
    );

    log.d('startStripePaymentWithExistingCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await stripe.confirmPayment(
        clientSecret,
        paymentMethodId: merchantPaymentMethodId ?? paymentMethodId);
    log.d(
        'startStripePaymentWithExistingCard.confirmPayment().paymentResponse=$paymentResponse');
  }

  @deprecated
  @override
  Future<void> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard,
      UserInvoiceAddress? invoiceAddress, bool saveCard) async {
    log.d('startStripePaymentWithNewCard().start()=$cart, $stripeCard');
    log.d('startStripePaymentWithNewCard().card.number=${stripeCard.number}');
    log.d(
        'startStripePaymentWithExistingCard().invoiceAddress=$invoiceAddress');
    await _cartProvider.setPaymentMode(
        cart.unitId,
        PaymentMode(
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
          caption: 'stripe',
        ));

    String? orderId = await _cartProvider.createAndSendOrderFromCart();
    log.d('startStripePaymentWithNewCard().orderId=$orderId');
    return startOrderStripePaymentWithNewCard(
      orderId,
      stripeCard,
      invoiceAddress,
      saveCard,
    );
  }

  @override
  Future<void> startOrderStripePaymentWithNewCard(
      String orderId,
      StripeCard stripeCard,
      UserInvoiceAddress? invoiceAddress,
      bool saveCard) async {
    Map<String, dynamic> paymentMethod =
        await _stripe.api.createPaymentMethodFromCard(stripeCard);
    String paymentMethodId = paymentMethod['id'];
    log.d('startStripePaymentWithNewCard().paymentMethodId=$paymentMethodId');

    var result = await GQL.amplify.execute(api.StartPaymentMutation(
      variables: api.StartPaymentArguments(
        orderId: orderId,
        paymentMethod: api.PaymentMethod.inapp,
        paymentMethodId: paymentMethodId,
        savePaymentMethod: saveCard,
        invoiceAddress: invoiceAddress != null
            ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson())
            : null,
      ),
    ));

    if (result.hasErrors) {
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
    }

    String? clientSecret = result.data!.startStripePayment?.clientSecret;
    log.d('startStripePaymentWithNewCard.clientSecret=$clientSecret');
    if (clientSecret == null) {
      throw StripeException(
          code: StripeException.CODE, message: 'Client secret is null!');
    }

    log.d('startStripePaymentWithNewCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse =
        await _stripe.confirmPayment(clientSecret);
    log.d(
        'startStripePaymentWithNewCard.confirmPayment().paymentResponse=$paymentResponse');
  }

  @override
  Future<bool> createPaymentMethodFromCard(
      String secret, StripeCard card) async {
    log.d('createPaymentMethodFromCard().start()');
    try {
      // _stripe.api.createPaymentMethodFromCard();
      final paymentMethod = await _stripe.api.createPaymentMethodFromCard(card);
      log.d('createPaymentMethodFromCard().paymentMethod=$paymentMethod');
      return false;
    } on Exception catch (e) {
      throw StripeException.fromException(StripeException.UNKNOWN_ERROR, e);
    }
  }

  Future<Map<String, dynamic>?> confirmPayment3DSecure(
      String clientSecret, String paymentMethodId) async {
    try {
      await _stripe.confirmPayment(clientSecret,
          paymentMethodId: paymentMethodId);
      final paymentIntentRes3dSecure =
          await _stripe.api.retrievePaymentIntent(clientSecret);
      return paymentIntentRes3dSecure;
    } catch (e) {
      return null;
    }
  }

  @override
  Future<StripePaymentMethod> createStripeCard(
      StripeCard card, String? name) async {
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
        throw GraphQLException.fromGraphQLError(
            StripeException.CODE, result.errors);
      }

      return StripePaymentMethod.fromJson(
          result.data!.createStripeCard!.toJson());
    } on Exception catch (e) {
      log.e('createStripeCard().exception=$e');
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
        throw GraphQLException.fromGraphQLError(
            StripeException.CODE, result.errors);
      }

      return !result.hasErrors;
    } on Exception catch (e) {
      log.e('deleteStripeCard().exception=$e');
      rethrow;
    }
  }

  @override
  Future<StripePaymentMethod> updateStripeCard(
      String cardId, String name) async {
    try {
      var result = await GQL.amplify.execute(api.UpdateStripeCardMutation(
        variables: api.UpdateStripeCardArguments(
          paymentMethodId: cardId,
          name: name,
        ),
      ));
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            StripeException.CODE, result.errors);
      }
      return StripePaymentMethod.fromJson(
          result.data!.updateMyStripeCard!.toJson());
    } on Exception catch (e) {
      log.e('updateStripeCard().exception=$e');
      rethrow;
    }
  }
}
