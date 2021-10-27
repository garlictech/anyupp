part of 'unit_select_bloc.dart';

abstract class UnitSelectEvent extends Equatable {
  const UnitSelectEvent();
}

class SelectUnit extends UnitSelectEvent {
  final GeoUnit unit;
  const SelectUnit(this.unit);

  @override
  List<Object?> get props => [unit];
}
