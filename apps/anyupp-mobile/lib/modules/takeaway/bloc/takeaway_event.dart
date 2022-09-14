import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import '/graphql/generated/crud-api.dart';

@immutable
abstract class TakeAwayEvent extends Equatable {
  const TakeAwayEvent();

  @override
  List<Object?> get props => [];
}

class SetServingMode extends TakeAwayEvent {
  final ServingMode servingMode;

  SetServingMode(this.servingMode);

  @override
  List<Object?> get props => [servingMode];
}

class GetServingMode extends TakeAwayEvent {
  const GetServingMode();
}

class ResetServingMode extends TakeAwayEvent {
  const ResetServingMode();
}
