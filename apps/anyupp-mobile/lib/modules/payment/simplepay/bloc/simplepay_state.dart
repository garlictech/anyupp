import 'package:equatable/equatable.dart';

import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';

abstract class SimplePayState extends Equatable {
  const SimplePayState();

  @override
  List<Object> get props => [];
}

class SimplePayInitialState extends SimplePayState {
  const SimplePayInitialState();
}

class SimplePayLoading extends SimplePayState {
  const SimplePayLoading();
}

class SimplePayError extends SimplePayState {}

class SimplePayPaymentResultState extends SimplePayState {
  final SimplePayPaymentResult result;
  const SimplePayPaymentResultState(this.result);
  List<Object> get props => [result];
}

class SimplePayWebStarted extends SimplePayState {
  final url;
  final transactionId;
  const SimplePayWebStarted(this.url, this.transactionId);

  List<Object> get props => [url, transactionId];
}
