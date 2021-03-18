import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/orders/orders.dart';

abstract class SimplePayEvent extends Equatable {
  const SimplePayEvent();

  @override
  List<Object> get props => [];
}

class StartSimplePayPayment extends SimplePayEvent {
  final PlacedOrder order;
  final GeoUnit unit;

  const StartSimplePayPayment(this.unit, this.order);

  @override
  List<Object> get props => [unit, order];
}

class CollectSimplePayTransactionStatus extends SimplePayEvent {
  final String transactionId;
  const CollectSimplePayTransactionStatus(this.transactionId);
  @override
  List<Object> get props => [transactionId];
}

class FinishSimplePayPayment extends SimplePayEvent {
  const FinishSimplePayPayment();
}
