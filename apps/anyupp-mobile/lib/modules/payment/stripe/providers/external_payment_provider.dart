import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/utils/enum.dart';

class ExternalPaymentProvider implements IExternalPaymentProvider {
  final ICartProvider _cartProvider;

  ExternalPaymentProvider(this._cartProvider);

  @override
  Future<void> startExternalPayment(Cart? cart, PaymentMode paymentMode,
      UserInvoiceAddress? invoiceAddress) async {
    log.d('startExternalPayment().start()=$paymentMode, cart=${cart?.id}');
    if (cart != null) {
      await _cartProvider.setPaymentMode(cart.unitId, paymentMode);
    }

    PaymentMethod method = PaymentMethod.values.firstWhere(
        (m) => stringFromEnum(m) == stringFromEnum(paymentMode.method),
        orElse: () => PaymentMethod.cash);

    String orderId = await _cartProvider.createAndSendOrderFromCart();
    log.d('startExternalPayment().orderId=$orderId');

    try {
      var result = await GQL.amplify.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: method,
        paymentMethodId: stringFromEnum(paymentMode.method),
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress != null
            ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson())
            : null,
      )));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      log.d('startExternalPayment().result=$result}');
      return;
    } on Exception catch (e) {
      log.e('startExternalPayment().exception=$e}');
      rethrow;
    }
  }

  @override
  Future<void> startOrderExternalPayment(String orderId,
      PaymentMode paymentMode, UserInvoiceAddress? invoiceAddress) async {
    log.d(
        'startOrderExternalPayment().orderId=$orderId, orderMethod=$paymentMode, invoice=$invoiceAddress');
    try {
      PaymentMethod method = PaymentMethod.values.firstWhere(
          (m) => stringFromEnum(m) == stringFromEnum(paymentMode.method),
          orElse: () => PaymentMethod.cash);
      log.d('startOrderExternalPayment().method=$method');

      var result = await GQL.amplify.execute(StartPaymentMutation(
          variables: StartPaymentArguments(
        orderId: orderId,
        paymentMethod: method,
        paymentMethodId: stringFromEnum(paymentMode.method),
        savePaymentMethod: false,
        invoiceAddress: invoiceAddress != null
            ? UserInvoiceAddressInput.fromJson(invoiceAddress.toJson())
            : null,
      )));
      log.d('startOrderExternalPayment().result=$result}');
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }
      await Future.delayed(Duration(seconds: 2));
      return;
    } on Exception catch (e) {
      log.e('startOrderExternalPayment().exception=$e}');
      rethrow;
    }
  }
}
