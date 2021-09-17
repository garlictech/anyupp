import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderCounterState extends Equatable {
  const BaseOrderCounterState();

  @override
  List<Object?> get props => [];
}

class OrderCounterLoadError extends BaseOrderCounterState {
  final String code;
  final String? message;
  final String? details;

  OrderCounterLoadError(this.code, this.message, this.details);

  @override
  List<Object?> get props => [code, message, details];
}

class ActiveOrderCount extends BaseOrderCounterState {
  final int count;
  final int timestamp;

  ActiveOrderCount(this.count) : timestamp = DateTime.now().millisecond;

  @override
  List<Object?> get props => [count, timestamp];
}
