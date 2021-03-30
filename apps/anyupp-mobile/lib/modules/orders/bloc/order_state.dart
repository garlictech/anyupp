import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderState extends Equatable {
  const BaseOrderState();

  @override
  List<Object> get props => [];
}

class NoOrdersLoaded extends BaseOrderState {
  const NoOrdersLoaded();
}

class OrderSubscriptionsState extends BaseOrderState {
  final String name;
  final bool started;
  const OrderSubscriptionsState(this.name, this.started);

  @override
  List<Object> get props => [name, started];
}
