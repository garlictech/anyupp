import 'package:equatable/equatable.dart';
import 'package:stripe_sdk/src/models/card.dart';

abstract class StripePaymentEvent extends Equatable {
  const StripePaymentEvent();
  @override
  List<Object> get props => [];
}

class PaymentMethodListEvent extends StripePaymentEvent {}

class StartStripePaymentWithExistingCardEvent extends StripePaymentEvent {
  final String chainId;
  final String unitId;
  final String userId;
  final String paymentMethodId;

  const StartStripePaymentWithExistingCardEvent(this.chainId, this.unitId, this.userId, this.paymentMethodId);

  @override
  List<Object> get props => [chainId, unitId, userId, paymentMethodId];
}

class StartStripePaymentWithNewCardEvent extends StripePaymentEvent {
  final String chainId;
  final String unitId;
  final String userId;
  final StripeCard stripeCard;
  final bool saveCard;

  const StartStripePaymentWithNewCardEvent({
    this.chainId,
    this.unitId,
    this.userId,
    this.stripeCard,
    this.saveCard,
  });

  @override
  List<Object> get props => [chainId, unitId, userId, stripeCard, saveCard];
}

class ResetStripePaymentState extends StripePaymentEvent {
  const ResetStripePaymentState();
}
