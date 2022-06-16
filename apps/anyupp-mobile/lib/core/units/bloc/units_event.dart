part of 'units_bloc.dart';

abstract class UnitsEvent extends Equatable {
  const UnitsEvent();
  @override
  List<Object?> get props => [];
}

class LoadUnitsNearLocation extends UnitsEvent {
  final LatLng location;

  const LoadUnitsNearLocation(this.location);

  @override
  List<Object?> get props => [location];
}

class DetectLocationAndLoadUnits extends UnitsEvent {
  const DetectLocationAndLoadUnits();
}

class FilterUnits extends UnitsEvent {
  final ServingMode servingMode;

  const FilterUnits({required this.servingMode});

  @override
  List<Object?> get props => [servingMode];
}
