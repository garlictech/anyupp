part of 'unit_select_bloc.dart';

abstract class UnitSelectEvent {
  const UnitSelectEvent();
}

class SelectUnit extends UnitSelectEvent {
  final GeoUnit unit;
  const SelectUnit(this.unit);
}
