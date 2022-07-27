import 'package:equatable/equatable.dart';
import '/models.dart';
import 'package:stripe_sdk/src/models/card.dart';

abstract class StripePaymentEvent extends Equatable {
  const StripePaymentEvent();
  @override
  List<Object?> get props => [];
}

class PaymentMethodListEvent extends StripePaymentEvent {}

class StartStripePaymentWithExistingCardEvent extends StripePaymentEvent {
  final String? orderId;
  final String paymentMethodId;
  final UserInvoiceAddress? invoiceAddress;

  const StartStripePaymentWithExistingCardEvent({this.orderId, required this.paymentMethodId, this.invoiceAddress});

  @override
  List<Object?> get props => [orderId, paymentMethodId, invoiceAddress];
}

class StartExternalPaymentEvent extends StripePaymentEvent {
  final PaymentMode paymentMode;
  final String? orderId;
  final UserInvoiceAddress? invoiceAddress;

  const StartExternalPaymentEvent({this.orderId, required this.paymentMode, this.invoiceAddress});

  @override
  List<Object?> get props => [paymentMode, orderId, invoiceAddress];
}

class StartStripePaymentWithNewCardEvent extends StripePaymentEvent {
  final String? orderId;
  final StripeCard stripeCard;
  final UserInvoiceAddress? invoiceAddress;
  final bool saveCard;

  const StartStripePaymentWithNewCardEvent({
    required this.stripeCard,
    required this.saveCard,
    this.orderId,
    required this.invoiceAddress,
  });

  @override
  List<Object?> get props => [stripeCard, saveCard, orderId, invoiceAddress];
}

class ResetStripePaymentState extends StripePaymentEvent {
  const ResetStripePaymentState();
}

class CreateStripeCardEvent extends StripePaymentEvent {
  final StripeCard stripeCard;
  final String name;

  CreateStripeCardEvent(this.stripeCard, this.name);

  @override
  List<Object?> get props => [stripeCard, name];
}

class UpdateStripeCardEvent extends StripePaymentEvent {
  final String stripeCardId;
  final String name;

  UpdateStripeCardEvent(this.stripeCardId, this.name);

  @override
  List<Object?> get props => [stripeCardId, name];
}

class DeleteStripeCardEvent extends StripePaymentEvent {
  final String stripeCardId;

  DeleteStripeCardEvent(this.stripeCardId);

  @override
  List<Object?> get props => [stripeCardId];
}
