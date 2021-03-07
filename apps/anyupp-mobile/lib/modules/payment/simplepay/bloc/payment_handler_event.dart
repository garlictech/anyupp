import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';

abstract class BasePaymentEvent extends Equatable {
  const BasePaymentEvent();

  @override
  List<Object> get props => [];
}

class UserPaymentIntentionSignalAction extends BasePaymentEvent {
  final GeoUnit unit;
  const UserPaymentIntentionSignalAction(this.unit);

  @override
  List<Object> get props => [unit];
}
