import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class ExternalPaymentProvider implements IExternalPaymentProvider {
  final IOrdersProvider _ordersProvider;

  ExternalPaymentProvider(this._ordersProvider);

  @override
  Future<void> startExternalPayment(Cart cart, PaymentMode paymentMode,
      UserInvoiceAddress invoiceAddress) async {
    print(
        'startExternalPayment().start().orderMethod=$paymentMode, cart=${cart?.id}');
    await _ordersProvider.setPaymentMode(cart.unitId, paymentMode);

    String orderId = await _ordersProvider.createAndSendOrderFromCart();
    print('startExternalPayment().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message:
              'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }
    try {
      QueryResult result = await GQL.backend.executeMutation(
        mutation: MUTATION_START_PAYMENT,
        variables: createStartPaymentRequestVariables(
          orderId: orderId,
          paymentMethod: paymentMode.method,
          paymentMethodId: paymentMode.method,
          saveCard: false,
          invoiceAddress: invoiceAddress,
        ),
      );
      print('startExternalPayment().result=$result}');
      return;
    } on Exception catch (e) {
      print('startExternalPayment().exception=$e}');
      rethrow;
    }
  }

  @override
  Future<void> startOrderExternalPayment(String orderId,
      PaymentMode paymentMode, UserInvoiceAddress invoiceAddress) async {
    print(
        'startOrderExternalPayment().orderId=$orderId, orderMethod=$paymentMode, invoice=$invoiceAddress');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message:
              'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }
    try {
      QueryResult result = await GQL.backend.executeMutation(
        mutation: MUTATION_START_PAYMENT,
        variables: createStartPaymentRequestVariables(
          orderId: orderId,
          paymentMethod: paymentMode.method,
          paymentMethodId: paymentMode.method,
          saveCard: false,
          invoiceAddress: invoiceAddress,
        ),
      );
      print('startOrderExternalPayment().result=$result}');
      await Future.delayed(Duration(seconds: 2));
      return;
    } on Exception catch (e) {
      print('startOrderExternalPayment().exception=$e}');
      rethrow;
    }
  }
}
