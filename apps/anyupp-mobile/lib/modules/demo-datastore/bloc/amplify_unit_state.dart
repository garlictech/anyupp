import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';

abstract class AmplifyUnitState extends Equatable {
  const AmplifyUnitState();

  @override
  List<Object> get props => [];
}

class AmplifyNoUnitLoaded extends AmplifyUnitState {

}

class AmplifyUnitListLoaded extends AmplifyUnitState {
  final List<Unit> units;

  const AmplifyUnitListLoaded(this.units);

  @override
  List<Object> get props => [units];
}

class AmplifyUnitsLoading extends AmplifyUnitState {
}

class AmplifyUnitLoaded extends AmplifyUnitState {
  final Unit unit;

  const AmplifyUnitLoaded(this.unit);

  @override
  List<Object> get props => [unit];
}

class AmplifyUnitError extends AmplifyUnitState {
  final String code;
  final String error;

  const AmplifyUnitError(this.code, this.error);

  @override
  List<Object> get props => [code, error];
}
