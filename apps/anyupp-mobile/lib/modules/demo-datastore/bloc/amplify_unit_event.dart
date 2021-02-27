import 'package:equatable/equatable.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

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

class AmplifyListLocalizations extends AmplifyUnitEvent {}
class AmplifyListGroups extends AmplifyUnitEvent {}

class AmplifyListCommon extends AmplifyUnitEvent {
  final ModelType<Model> type;

  AmplifyListCommon(this.type);

  @override
  List<Object> get props => [type];
}
