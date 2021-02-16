import 'package:equatable/equatable.dart';

abstract class BasePaymentState extends Equatable {
  const BasePaymentState();

  @override
  List<Object> get props => [];
}

class PaymentNoState extends BasePaymentState {
  const PaymentNoState();
}

class PaymentInProgress extends BasePaymentState {
  const PaymentInProgress();
}
