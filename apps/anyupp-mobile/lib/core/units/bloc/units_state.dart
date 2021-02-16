part of 'units_bloc.dart';

@immutable
abstract class UnitsState extends Equatable {
  const UnitsState();

  @override
  List<Object> get props => [];
}

class UnitsInitial extends UnitsState {}

class UnitsLoading extends UnitsState {}

class UnitsLoaded extends UnitsState {
  final List<GeoUnit> units;

  const UnitsLoaded([this.units = const []]);

  @override
  List<Object> get props => [units];
}

class UnitsNoNearUnit extends UnitsState {}

class UnitsNotLoaded extends UnitsState {
  final String reasonCode;
  final String reasonMessage;

  const UnitsNotLoaded({this.reasonCode, this.reasonMessage});

  @override
  List<Object> get props => [reasonCode, reasonMessage];
}
