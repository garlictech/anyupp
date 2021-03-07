import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/demo-datastore/bloc/amplify_unit_event.dart';
import 'package:fa_prev/modules/demo-datastore/bloc/amplify_unit_state.dart';
import 'package:fa_prev/modules/demo-datastore/repository/amplify_unit_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AmplifyUnitBloc extends Bloc<AmplifyUnitEvent, AmplifyUnitState> {
  final AmplifyUnitRepository _repository;

  AmplifyUnitBloc(this._repository) : super(AmplifyNoUnitLoaded());

  @override
  Stream<AmplifyUnitState> mapEventToState(AmplifyUnitEvent event) async* {
    print('AmplifyUnitBloc.event=$event');
    try {
      // if (event is AmplifyListUnits) {
      //   yield AmplifyUnitsLoading();
      //   List<Unit> units = await _repository.listUnits();
      //   yield AmplifyUnitListLoaded(units);
      // }

      // if (event is AmplifyGetUnitById) {
      //   yield AmplifyUnitsLoading();
      //   Unit unit = await _repository.getUnitById(event.id);
      //   yield AmplifyUnitLoaded(unit);
      // }

      // if (event is AmplifyListLocalizations) {
      //   yield AmplifyUnitsLoading();
      //   List<LocalizedItem> items = await _repository.listLocalizations();
      //   yield AmplifyLocalizationListLoaded(items);
      // }

      // if (event is AmplifyListGroups) {
      //   yield AmplifyUnitsLoading();
      //   List<Group> groups = await _repository.listGroups();
      //   yield AmplifyGroupListLoaded(groups);
      // }
    } on Exception catch (e) {
      yield AmplifyUnitError('AMPLIFY_UNIT_ERROR', e.toString());
    }
  }
}
