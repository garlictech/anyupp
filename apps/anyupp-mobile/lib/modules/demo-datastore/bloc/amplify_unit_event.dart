import 'package:equatable/equatable.dart';

abstract class AmplifyUnitEvent extends Equatable {
  const AmplifyUnitEvent();

  @override
  List<Object> get props => [];
}

class AmplifyListUnits extends AmplifyUnitEvent {}

class AmplifyGetUnitById extends AmplifyUnitEvent {
  final String id;

  const AmplifyGetUnitById(this.id);

  @override
  List<Object> get props => [id];
}
