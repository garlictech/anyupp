import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import '/graphql/generated/crud-api.dart';

@immutable
abstract class TakeAwayState extends Equatable {
  const TakeAwayState();

  @override
  List<Object?> get props => [];
}

class NoServingModeSelectedState extends TakeAwayState {
  const NoServingModeSelectedState();
}

class ServingModeSelectedState extends TakeAwayState {
  final ServingMode servingMode;

  ServingModeSelectedState(this.servingMode);

  @override
  List<Object?> get props => [servingMode];
}
