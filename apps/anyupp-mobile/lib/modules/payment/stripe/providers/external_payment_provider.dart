
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:graphql_flutter/graphql_flutter.dart';


class ExternalPaymentProvider implements IExternalPaymentProvider {

  final IOrdersProvider _ordersProvider;

  ExternalPaymentProvider(this._ordersProvider);


  @override
  Future<void> startExternalPayment(Cart cart, String orderMethod) async {
    print('startExternalPayment().start()=$cart');

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startExternalPayment().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }

    QueryResult result = await GQL.backend.executeMutation(
      mutation: MUTATION_START_PAYMENT,
      variables: {
        'orderId': orderId,
        'paymentMethod': orderMethod,
        'paymentMethodId': 'cash',
        'savePaymentMethod': false,
      },
    );
    print('startExternalPayment().result=$result}');
    return;
  }

   @override
  Future<void> startOrderExternalPayment(String orderId, String orderMethod) async {
    print('startOrderExternalPayment().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }

    QueryResult result = await GQL.backend.executeMutation(
      mutation: MUTATION_START_PAYMENT,
      variables: {
        'orderId': orderId,
        'paymentMethod': orderMethod,
        'paymentMethodId': 'cash',
        'savePaymentMethod': false,
      },
    );
    print('startOrderExternalPayment().result=$result}');
    await Future.delayed(Duration(seconds: 2));
    return;
  }
}
