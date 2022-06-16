part of 'units_bloc.dart';

abstract class UnitsState extends Equatable {
  const UnitsState();

  @override
  List<Object?> get props => [];
}

class UnitsInitial extends UnitsState {}

class UnitsLoading extends UnitsState {}

class UnitsLoaded extends UnitsState {
  final List<GeoUnit> units;
  final LatLng? userLocation;

  const UnitsLoaded({required this.units, this.userLocation});

  @override
  List<Object?> get props => [units, userLocation];
}

class UnitsNoNearUnit extends UnitsState {}

class UnitsNotLoaded extends UnitsState {
  final String reasonCode;
  final String? reasonMessage;

  const UnitsNotLoaded({required this.reasonCode, this.reasonMessage});

  @override
  List<Object?> get props => [reasonCode, reasonMessage];
}
