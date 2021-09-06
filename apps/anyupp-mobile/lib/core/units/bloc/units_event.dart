part of 'units_bloc.dart';

abstract class UnitsEvent {
  const UnitsEvent();
}

class LoadUnitsNearLocation extends UnitsEvent {
  final LatLng location;

  const LoadUnitsNearLocation(this.location);
}

class DetectLocationAndLoadUnits extends UnitsEvent {
  const DetectLocationAndLoadUnits();
}
