part of 'units_bloc.dart';

class UnitFilter extends Equatable {
  final ServingMode? servingMode;

  const UnitFilter({this.servingMode});

  @override
  List<Object?> get props => [servingMode];
}

abstract class UnitsEvent extends Equatable {
  const UnitsEvent();
  @override
  List<Object?> get props => [];
}

class LoadUnitsNearLocation extends UnitsEvent {
  final LatLng location;
  final UnitFilter? filter;

  const LoadUnitsNearLocation({required this.location, this.filter});

  @override
  List<Object?> get props => [location, filter];
}

class DetectLocationAndLoadUnits extends UnitsEvent {
  final UnitFilter? filter;
  const DetectLocationAndLoadUnits({this.filter});
  @override
  List<Object?> get props => [filter];
}

class FilterUnits extends UnitsEvent {
  final UnitFilter? filter;

  const FilterUnits({this.filter});

  @override
  List<Object?> get props => [filter];
}
