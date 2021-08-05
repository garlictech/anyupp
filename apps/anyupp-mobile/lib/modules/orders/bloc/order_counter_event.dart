import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderCounterAction extends Equatable {
  const BaseOrderCounterAction();

  @override
  List<Object> get props => [];
}

class GetActiveOrderCount extends BaseOrderCounterAction {
  final String unitId;

  GetActiveOrderCount(this.unitId);
  @override
  List<Object> get props => [unitId];
}

class UpdateActiveOrderCount extends BaseOrderCounterAction {
  final int count;

  UpdateActiveOrderCount(this.count);
  @override
  List<Object> get props => [count];
}
