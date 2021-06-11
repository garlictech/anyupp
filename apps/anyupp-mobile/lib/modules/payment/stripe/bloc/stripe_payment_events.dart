import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';
import 'package:stripe_sdk/src/models/card.dart';

abstract class StripePaymentEvent extends Equatable {
  const StripePaymentEvent();
  @override
  List<Object> get props => [];
}

class PaymentMethodListEvent extends StripePaymentEvent {}

class StartStripePaymentWithExistingCardEvent extends StripePaymentEvent {
  final String orderId;
  final String paymentMethodId;
  final UserInvoiceAddress invoiceAddress;

  const StartStripePaymentWithExistingCardEvent({this.orderId, this.paymentMethodId, this.invoiceAddress});

  @override
  List<Object> get props => [orderId, paymentMethodId, invoiceAddress];
}

class StartExternalPaymentEvent extends StripePaymentEvent {
  final String paymentMethod;
  final String orderId;
  final UserInvoiceAddress invoiceAddress;

  const StartExternalPaymentEvent({this.paymentMethod, this.orderId, this.invoiceAddress});

  @override
  List<Object> get props => [paymentMethod, orderId, invoiceAddress];
}

class StartStripePaymentWithNewCardEvent extends StripePaymentEvent {
  final String orderId;
  final StripeCard stripeCard;
  final UserInvoiceAddress invoiceAddress;
  final bool saveCard;

  const StartStripePaymentWithNewCardEvent({
    this.stripeCard,
    this.saveCard,
    this.orderId,
    this.invoiceAddress,
  });

  @override
  List<Object> get props => [stripeCard, saveCard, orderId, invoiceAddress];
}

class ResetStripePaymentState extends StripePaymentEvent {
  const ResetStripePaymentState();
}
