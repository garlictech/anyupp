import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:stripe_sdk/stripe_sdk.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

import 'stripe_payment_provider_interface.dart';

class GraphQLStripePaymentProvider implements IStripePaymentProvider {
  final Stripe _stripe;
  final IOrdersProvider _ordersProvider;

  GraphQLStripePaymentProvider(this._stripe, this._ordersProvider);

  @override
  Future<List<StripePaymentMethod>> getPaymentMethods() async {
    print('getPaymentMethods().start()');
    try {
      QueryResult result = await GQL.backend.executeQuery(
        query: QUERY_LIST_PAYMENT_METHODS,
        variables: {},
      );

      List<dynamic> items = result.data['listStripeCards'];
      List<StripePaymentMethod> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(StripePaymentMethod.fromMap(Map<String, dynamic>.from(items[i])));
        }
      }
      // results.add(createPaymentMethod(Map<String,dynamic>.from(card)));
      print('getPaymentMethods.results=${results.length}');
      return results;
    } catch (err) {
      print('err charging user: ${err.toString()}');
      rethrow;
    }
  }

  @override
  Future<void> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId) async {
    print('startStripePaymentWithExistingCard().start()=$cart');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithExistingCard().orderId=$orderId');
    return startOrderStripePaymentWithExistingCard(orderId, paymentMethodId);
  }

  @override
  Future<void> startOrderStripePaymentWithExistingCard(String orderId, String paymentMethodId) async {
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }

    QueryResult result = await GQL.backend.executeMutation(
      mutation: MUTATION_START_PAYMENT,
      variables: {
        'orderId': orderId,
        'paymentMethod': 'inapp',
        'paymentMethodId': paymentMethodId,
        'savePaymentMethod': false,
      },
    );

    if (result.data == null || result.data['startStripePayment'] == null) {
      return;
    }

    String clientSecret = result.data['startStripePayment']['clientSecret'];
    print('startStripePaymentWithExistingCard.clientSecret=$clientSecret');

    print('startStripePaymentWithExistingCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await _stripe.confirmPayment(clientSecret, paymentMethodId: paymentMethodId);
    print('startStripePaymentWithExistingCard.confirmPayment().paymentResponse=$paymentResponse');
  }

  @override
  Future<void> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard) async {
    print('startStripePaymentWithNewCard().start()=$cart, $stripeCard');
    print('startStripePaymentWithNewCard().card.number=${stripeCard.number}');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithNewCard().orderId=$orderId');
    return startOrderStripePaymentWithNewCard(orderId, stripeCard, saveCard);
  }

  @override
  Future<void> startOrderStripePaymentWithNewCard(String orderId, StripeCard stripeCard, bool saveCard) async {
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR, message: 'createAndSendOrderFromCart() error. OrderId null!');
    }

    Map<String, dynamic> paymentMethod = await _stripe.api.createPaymentMethodFromCard(stripeCard);
    String paymentMethodId = paymentMethod['id'];
    print('startStripePaymentWithNewCard().paymentMethodId=$paymentMethodId');

    QueryResult result = await GQL.backend.executeMutation(
      mutation: MUTATION_START_PAYMENT,
      variables: {
        'orderId': orderId,
        'paymentMethod': 'inapp',
        'paymentMethodId': paymentMethodId,
        'savePaymentMethod': saveCard,
      },
    );

    if (result.data == null || result.data['startStripePayment'] == null) {
      return;
    }

    String clientSecret = result.data['startStripePayment']['clientSecret'];
    print('startStripePaymentWithNewCard.clientSecret=$clientSecret');

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

  Future<Map<String, dynamic>> confirmPayment3DSecure(String clientSecret, String paymentMethodId) async {
    try {
      await _stripe.confirmPayment(clientSecret, paymentMethodId: paymentMethodId);
      final paymentIntentRes3dSecure = await _stripe.api.retrievePaymentIntent(clientSecret);
      return paymentIntentRes3dSecure;
    } catch (e) {
      return null;
    }
  }
}
