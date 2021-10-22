import 'package:fa_prev/graphql/generated/anyupp-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/utils/enum.dart';

class ExternalPaymentProvider implements IExternalPaymentProvider {
  final ICartProvider _cartProvider;

  ExternalPaymentProvider(this._cartProvider);

  @override
  Future<void> startExternalPayment(Cart cart, PaymentMode paymentMode,
      UserInvoiceAddress? invoiceAddress) async {
    print(
        'startExternalPayment().start().orderMethod=$paymentMode, cart=${cart.id}');
    await _cartProvider.setPaymentMode(cart.unitId, paymentMode);

    PaymentMethod method = PaymentMethod.values.firstWhere(
        (m) => stringFromEnum(m) == stringFromEnum(paymentMode.method),
        orElse: () => PaymentMethod.cash);

    String orderId = await _cartProvider.createAndSendOrderFromCart();
    print('startExternalPayment().orderId=$orderId');

    try {
      var result = await GQL.backend.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: method,
        paymentMethodId: stringFromEnum(paymentMode.method),
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress,
      )));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      print('startExternalPayment().result=$result}');
      return;
    } on Exception catch (e) {
      print('startExternalPayment().exception=$e}');
      rethrow;
    }
  }

  @override
  Future<void> startOrderExternalPayment(String orderId,
      PaymentMode paymentMode, UserInvoiceAddress? invoiceAddress) async {
    print(
        'startOrderExternalPayment().orderId=$orderId, orderMethod=$paymentMode, invoice=$invoiceAddress');
    try {
      PaymentMethod method = PaymentMethod.values.firstWhere(
          (m) => stringFromEnum(m) == stringFromEnum(paymentMode.method),
          orElse: () => PaymentMethod.cash);
      print('startOrderExternalPayment().method=$method');

      var result = await GQL.backend.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: method,
        paymentMethodId: stringFromEnum(paymentMode.method),
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress,
      )));
      print('startOrderExternalPayment().result=$result}');
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }
      await Future.delayed(Duration(seconds: 2));
      return;
    } on Exception catch (e) {
      print('startOrderExternalPayment().exception=$e}');
      rethrow;
    }
  }
}
