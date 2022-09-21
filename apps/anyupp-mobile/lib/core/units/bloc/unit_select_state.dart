part of 'unit_select_bloc.dart';

abstract class UnitSelectState extends Equatable {
  Unit? get currentUnit;
  const UnitSelectState();

  @override
  List<Object?> get props => [];
}

class NoUnitSelected extends UnitSelectState {
  @override
  get currentUnit => null;
}

class UnitSelected extends UnitSelectState {
  final Unit unit;
  const UnitSelected(this.unit);

  @override
  get currentUnit => unit;

  @override
  List<Object?> get props => [unit];

  @override
  String toString() =>
      'UnitSelected { unitId: $unit.id, groupId: $unit.groupId, chainId: $unit.chainId }';
}
