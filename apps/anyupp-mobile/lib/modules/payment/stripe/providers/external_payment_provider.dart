import 'package:fa_prev/graphql/generated/anyupp-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';

class ExternalPaymentProvider implements IExternalPaymentProvider {
  final ICartProvider _cartProvider;

  ExternalPaymentProvider(this._cartProvider);

  @override
  Future<void> startExternalPayment(Cart cart, PaymentMode paymentMode, UserInvoiceAddress invoiceAddress) async {
    print('startExternalPayment().start().orderMethod=$paymentMode, cart=${cart?.id}');
    await _cartProvider.setPaymentMode(cart.unitId, paymentMode);

    String orderId = await _cartProvider.createAndSendOrderFromCart();
    print('startExternalPayment().orderId=$orderId');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }
    try {
      var result = await GQL.backend.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: PaymentMethod.values
            .firstWhere((m) => m.toString() == paymentMode.method, orElse: () => PaymentMethod.cash),
        paymentMethodId: paymentMode.method,
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress,
      )));

      // QueryResult result = await GQL.backend.executeMutation(
      //   mutation: MUTATION_START_PAYMENT,
      //   variables: createStartPaymentRequestVariables(
      //     orderId: orderId,
      //     paymentMethod: paymentMode.method,
      //     paymentMethodId: paymentMode.method,
      //     saveCard: false,
      //     invoiceAddress: invoiceAddress,
      //   ),
      // );
      print('startExternalPayment().result=$result}');
      return;
    } on Exception catch (e) {
      print('startExternalPayment().exception=$e}');
      rethrow;
    }
  }

  @override
  Future<void> startOrderExternalPayment(
      String orderId, PaymentMode paymentMode, UserInvoiceAddress invoiceAddress) async {
    print('startOrderExternalPayment().orderId=$orderId, orderMethod=$paymentMode, invoice=$invoiceAddress');
    if (orderId == null) {
      throw StripeException(
          code: StripeException.UNKNOWN_ERROR,
          message: 'response validation error createAndSendOrderFromCart()! OrderId cannot be null!');
    }
    try {
      var result = await GQL.backend.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: PaymentMethod.values
            .firstWhere((m) => m.toString() == paymentMode.method, orElse: () => PaymentMethod.cash),
        paymentMethodId: paymentMode.method,
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress,
      )));
      // QueryResult result = await GQL.backend.executeMutation(
      //   mutation: MUTATION_START_PAYMENT,
      //   variables: createStartPaymentRequestVariables(
      //     orderId: orderId,
      //     paymentMethod: paymentMode.method,
      //     paymentMethodId: paymentMode.method,
      //     saveCard: false,
      //     invoiceAddress: invoiceAddress,
      //   ),
      // );
      print('startOrderExternalPayment().result=$result}');
      await Future.delayed(Duration(seconds: 2));
      return;
    } on Exception catch (e) {
      print('startOrderExternalPayment().exception=$e}');
      rethrow;
    }
  }
}
