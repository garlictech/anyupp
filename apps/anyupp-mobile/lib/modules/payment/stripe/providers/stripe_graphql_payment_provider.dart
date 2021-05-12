import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/foundation.dart';
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
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_LIST_PAYMENT_METHODS),
        variables: {},
      ));

      print('getPaymentMethods.response.data=$result');
      if (result.hasException) {
        print('getPaymentMethods.error=${result.exception}');
        throw result.exception;
      }

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
  Future<String> startStripePaymentWithExistingCard(Cart cart, String paymentMethodId) async {
    print('startStripePaymentWithExistingCard().start()=$cart');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithExistingCard().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }

    ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
    QueryResult result = await _client.value.mutate(MutationOptions(
      document: gql(MUTATION_START_PAYMENT),
      variables: {
        'orderId': orderId,
        'paymentMethod': 'INAPP',
        'paymentMethodId': paymentMethodId,
        'savePaymentMethod': false,
      },
    ));

    print('startStripePaymentWithExistingCard.response.data=$result');
    if (result.hasException) {
      print('startStripePaymentWithExistingCard.error=${result.exception}');
      throw result.exception;
    }

    String clientSecret = result.data['startStripePayment']['clientSecret'];
    print('startStripePaymentWithExistingCard.clientSecret=$clientSecret');

    print('startStripePaymentWithExistingCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await _stripe.confirmPayment(clientSecret, paymentMethodId: paymentMethodId);
    print('startStripePaymentWithExistingCard.confirmPayment().paymentResponse=$paymentResponse');

    return null;
  }

  @override
  Future<String> startStripePaymentWithNewCard(Cart cart, StripeCard stripeCard, bool saveCard) async {
    print('startStripePaymentWithNewCard().start()=$cart, $stripeCard');
    print('startStripePaymentWithNewCard().card.number=${stripeCard.number}');

    Map<String, dynamic> paymentMethod = await _stripe.api.createPaymentMethodFromCard(stripeCard);
    String paymentMethodId = paymentMethod['id'];
    print('startStripePaymentWithNewCard().paymentMethodId=$paymentMethodId');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startStripePaymentWithNewCard().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR, message: 'createAndSendOrderFromCart() error. OrderId null!');
    }

    ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
    QueryResult result = await _client.value.mutate(MutationOptions(
      document: gql(MUTATION_START_PAYMENT),
      variables: {
        'orderId': orderId,
        'paymentMethod': 'INAPP',
        'paymentMethodId': paymentMethodId,
        'savePaymentMethod': saveCard,
      },
    ));

    print('startStripePaymentWithNewCard.response.data=$result');
    if (result.hasException) {
      print('startStripePaymentWithNewCard.error=${result.exception}');
      throw result.exception;
    }

    String clientSecret = result.data['startStripePayment']['clientSecret'];
    print('startStripePaymentWithNewCard.clientSecret=$clientSecret');

    print('startStripePaymentWithNewCard.confirmPayment().start()');
    Map<String, dynamic> paymentResponse = await _stripe.confirmPayment(clientSecret);
    print('startStripePaymentWithNewCard.confirmPayment().paymentResponse=$paymentResponse');

    return null;
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
