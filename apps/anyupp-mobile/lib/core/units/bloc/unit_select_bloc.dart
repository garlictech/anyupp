import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:meta/meta.dart';

part 'unit_select_event.dart';
part 'unit_select_state.dart';

class UnitSelectBloc extends Bloc<UnitSelectEvent, UnitSelectState> {
  UnitSelectBloc() : super(NoUnitSelected());

  @override
  Stream<UnitSelectState> mapEventToState(
    UnitSelectEvent event,
  ) async* {
    if (event is SelectUnit) {
      yield UnitSelected(event.unit);
    }
  }
}
