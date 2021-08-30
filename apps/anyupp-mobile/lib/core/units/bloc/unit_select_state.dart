part of 'unit_select_bloc.dart';

abstract class UnitSelectState extends Equatable {
  const UnitSelectState();

  @override
  List<Object?> get props => [];
}

class NoUnitSelected extends UnitSelectState {}

class UnitSelected extends UnitSelectState {
  final GeoUnit unit;
  const UnitSelected(this.unit);

  @override
  List<Object?> get props => [unit.chainId, unit.groupId, unit.id];

  @override
  String toString() => 'UnitSelected { unitId: $unit.id, groupId: $unit.groupId, chainId: $unit.chainId }';
}
