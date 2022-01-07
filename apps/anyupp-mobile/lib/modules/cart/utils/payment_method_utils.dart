import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/modules/cart/cart.dart';

PaymentMode getPaymentModeFromSelection(PaymentMethodExt? selectedMethod) {
  switch (selectedMethod?.method ?? PaymentMethod.artemisUnknown) {
    case PaymentMethod.cash:
      return PaymentMode(
          method: PaymentMethod.cash, type: PaymentType.cash, caption: 'cash');
    case PaymentMethod.card:
      return PaymentMode(
          method: PaymentMethod.card, type: PaymentType.card, caption: 'card');
    case PaymentMethod.inapp:
      return PaymentMode(
          method: PaymentMethod.inapp,
          type: PaymentType.stripe,
          caption: 'stripe');
    default:
      return PaymentMode(
          method: PaymentMethod.cash, type: PaymentType.cash, caption: 'cash');
  }
}
