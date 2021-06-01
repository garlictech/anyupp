import 'package:equatable/equatable.dart';
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

  const StartStripePaymentWithExistingCardEvent({this.orderId, this.paymentMethodId});

  @override
  List<Object> get props => [orderId, paymentMethodId];
}

class StartExternalPaymentEvent extends StripePaymentEvent {
  final String paymentMethod;
  final String orderId;

  const StartExternalPaymentEvent({this.paymentMethod, this.orderId});

  @override
  List<Object> get props => [paymentMethod, orderId];
}

class StartStripePaymentWithNewCardEvent extends StripePaymentEvent {
  final String orderId;
  final StripeCard stripeCard;
  final bool saveCard;

  const StartStripePaymentWithNewCardEvent({
    this.stripeCard,
    this.saveCard,
    this.orderId
  });

  @override
  List<Object> get props => [stripeCard, saveCard, orderId];
}

class ResetStripePaymentState extends StripePaymentEvent {
  const ResetStripePaymentState();
}
