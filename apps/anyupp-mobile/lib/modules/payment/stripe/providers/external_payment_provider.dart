import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/providers/external_payment_provider_interface.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';


class ExternalPaymentProvider implements IExternalPaymentProvider {

  final CrudApi.OrdersProvider _ordersProvider;

  ExternalPaymentProvider(this._ordersProvider);


  @override
  Future<void> startExternalPayment(Cart cart, String orderMethod) async {
    print('startStripePaymentWithExistingCard().start()=$cart');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startExternalPayment().orderId=$orderId');
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
        'paymentMethod': orderMethod,
        'paymentMethodId': null,
        'savePaymentMethod': false,
      },
    ));

    print('startExternalPayment.response.data=$result');
    if (result.hasException) {
      print('startExternalPayment.error=${result.exception}');
      throw result.exception;
    }

    return null;
  }
}
