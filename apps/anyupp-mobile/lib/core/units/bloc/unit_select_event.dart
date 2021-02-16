part of 'unit_select_bloc.dart';

@immutable
abstract class UnitSelectEvent {
  const UnitSelectEvent();
}

class SelectUnit extends UnitSelectEvent {
  final GeoUnit unit;
  const SelectUnit(this.unit);
}
