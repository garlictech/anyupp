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
  final Cart cart;
  final String paymentMethodId;

  const StartStripePaymentWithExistingCardEvent({this.cart, this.paymentMethodId});

  @override
  List<Object> get props => [cart, paymentMethodId];
}

class StartExternalPaymentEvent extends StripePaymentEvent {
  final String paymentMethod;

  const StartExternalPaymentEvent({this.paymentMethod});

  @override
  List<Object> get props => [paymentMethod];
}

class StartStripePaymentWithNewCardEvent extends StripePaymentEvent {
  final StripeCard stripeCard;
  final bool saveCard;

  const StartStripePaymentWithNewCardEvent({
    this.stripeCard,
    this.saveCard,
  });

  @override
  List<Object> get props => [stripeCard, saveCard];
}

class ResetStripePaymentState extends StripePaymentEvent {
  const ResetStripePaymentState();
}
