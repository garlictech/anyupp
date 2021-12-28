import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';

part 'unit_select_event.dart';
part 'unit_select_state.dart';

class UnitSelectBloc extends Bloc<UnitSelectEvent, UnitSelectState> {
  UnitSelectBloc() : super(NoUnitSelected()) {
    on<SelectUnit>(_onSelectUnit);
  }

  FutureOr<void> _onSelectUnit(
      SelectUnit event, Emitter<UnitSelectState> emit) {
    emit(UnitSelected(event.unit));
  }
}
