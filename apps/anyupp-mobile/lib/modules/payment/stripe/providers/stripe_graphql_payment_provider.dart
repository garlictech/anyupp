import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'package:stripe_sdk/stripe_sdk.dart';
import 'package:stripe_sdk/stripe_sdk_ui.dart';

import 'stripe_payment_provider_interface.dart';

class GraphQLStripePaymentProvider implements IStripePaymentProvider {
  // ignore: unused_field
  final ValueNotifier<GraphQLClient> _client;
  final Stripe _stripe;

  GraphQLStripePaymentProvider(this._client, this._stripe);

  @override
  Future<List<StripeCard>> getPaymentMethods() async {
    return null;
    // print('getPaymentMethods().start().doc=${GetCustomerStripeCardsQuery().document.definitions}');
    // final results = await _client.query(
    //   QueryOptions(
    //     document: GetCustomerStripeCardsQuery().document,
    //     variables: GetCustomerStripeCardsArguments(
    //       customerId: 'cus_HqrrboxTxefVa3',
    //     ).toJson(),
    //   ),
    // );
    // print(results);
    // if (results.hasException) {
    //   throw results.exception;
    // } else {
    //   return GetCustomerStripeCards$Query.fromJson(results.data).getCustomerStripeCards;
    // }
  }

  @override
  Future<String> startStripePaymentWithExistingCard(
      String chainId, String unitId, String userId, String paymentMethodId) async {
    print('startStripePayment().start()=$chainId, $unitId, $userId');
    // final result = await client.mutate(MutationOptions(
    //   documentNode: StartStripePaymentMutation(
    //     variables: StartStripePaymentArguments(chainId: chainId, unitId: unitId, userId: userId),
    //   ).document,
    // ));
    // final result = await _client.mutate(MutationOptions(
    //   document: StartStripePaymentMutation().document,
    //   variables: StartStripePaymentArguments(
    //     chainId: chainId,
    //     unitId: unitId,
    //     userId: userId,
    //   ).toJson(),
    // ));
    // if (result.hasException) {
    //   print('startStripePayment().error=${result.exception}');
    //   throw StripeException.fromException(StripeException.UNKNOWN_ERROR, result.exception);
    // } else {
    //   print('startStripePayment().result=${result.data}');
    //   return '${result.data["startStripePayment"]}';
    // }
    return null;
  }

  @override
  Future<String> startStripePaymentWithNewCard(
      String chainId, String unitId, String userId, StripeCard stripeCard, bool saveCard) async {
    print('startStripePaymentWithNewCard().start()=$chainId, $unitId, $userId, $stripeCard');
    print('startStripePaymentWithNewCard().card.number=${stripeCard.number}');
    return null;
    // final result = await _client.mutate(MutationOptions(
    //   document: StartStripePaymentMutation().document,
    //   variables: StartStripePaymentArguments(
    //     chainId: chainId,
    //     unitId: unitId,
    //     userId: userId,
    //   ).toJson(),
    // ));

    // if (result.hasException) {
    //   print('startStripePaymentWithNewCard().error=${result.exception}');
    //   throw StripeException.fromException(StripeException.UNKNOWN_ERROR, result.exception);
    // }

    // print('startStripePaymentWithNewCard().result=${result.data}');
    // final String clientSecret = result.data['startStripePayment'];
    // print('startStripePaymentWithNewCard().client_secret=$clientSecret');

    // // TODO 3D ellenorzes!!!
    // // if (result['status'] == 'requires_action') { 
    // //   paymentIntentRes = await confirmPayment3DSecure(clientSecret, paymentMethodId);
    // // } 
    // Map<String, dynamic> params = {
    //   'payment_method_data': stripeCard.toPaymentMethod()
    // };

    // if (saveCard) {
    //   params['setup_future_usage'] = 'off_session';
    // }

    //  //Map<String, dynamic> params = stripeCard.toPaymentMethod();
    //  print('startStripePaymentWithNewCard().params=$params');

    //  Map<String, dynamic> paymentResponse = await _stripe.api.confirmPaymentIntent(clientSecret, data: params);
    //  print('startStripePaymentWithNewCard().paymentResponse=$paymentResponse');
    //  if (paymentResponse['status'] == 'succeeded') {
    //    return paymentResponse['status'];
    //  }

    // // await _stripe.api.

    // // return '$clientSecret';

    // // TODO nem string lesz a response!!!
    // return paymentResponse['status'];
  }

  @override
  Future<bool> createPaymentMethodFromCard(String secret, StripeCard card) async {
    print('createPaymentMethodFromCard().start()');
    try {
      // _stripe.api.createPaymentMethodFromCard();
      final paymentMethod = await _stripe.api.createPaymentMethodFromCard(card);
      print('createPaymentMethodFromCard().paymentMethod=$paymentMethod');
    return false;

      // final result = await http.post(
      //   "URL/payment-intent",
      //   body: jsonEncode(
      //     {
      //       'payment_method_id': paymentMethod['id'],
      //       'email': emailAddress,
      //       'amount': totalPrice,
      //       'currencyCode': currencyCode,
      //     },
      //   ),
      //   headers: {
      //     HttpHeaders.contentTypeHeader: ContentType.json.value,
      //   },
      // );

      // if (result.statusCode == HttpStatus.ok) {
      //   final body = json.decode(result.body) ?? {};
      //   final success = body['success'];

      //   if (success) {
      //     Map<String, dynamic> result = await _stripe.api.retrievePaymentIntent(
      //       body['client_secret'],
      //     );
      //   }
      // }
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
