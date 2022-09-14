import 'package:equatable/equatable.dart';
import '/models.dart';

abstract class StripePaymentState extends Equatable {
  const StripePaymentState();
  @override
  List<Object?> get props => [];
}

class StripePaymentInitialState extends StripePaymentState {
  const StripePaymentInitialState();
}

class StripePaymentLoading extends StripePaymentState {
  const StripePaymentLoading();
}

class StripePaymentMethodsList extends StripePaymentState {
  final List<StripePaymentMethod>? data;

  const StripePaymentMethodsList(this.data);

  @override
  List<Object?> get props => [data];
}

class StripeError extends StripePaymentState {
  final String code;
  final String message;

  const StripeError(this.code, this.message);

  @override
  List<Object?> get props => [code, message];
}

class StripePaymentIntentReceived extends StripePaymentState {
  final String key;

  const StripePaymentIntentReceived(this.key);

  @override
  List<Object?> get props => [key];
}

class StripeOperationSuccess extends StripePaymentState {
  const StripeOperationSuccess();
}

class StripeCardCreated extends StripePaymentState {
  const StripeCardCreated();
}
