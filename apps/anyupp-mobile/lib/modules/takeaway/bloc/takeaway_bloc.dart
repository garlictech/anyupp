import 'dart:async';

import 'package:fa_prev/models/core/parsers.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TakeAwayBloc extends Bloc<TakeAwayEvent, TakeAwayState> {
  static final String KEY_SERVING_MODE = 'SERVING_MODE';

  TakeAwayBloc() : super(NoServingModeSelectedState()) {
    on<GetServingMode>(_onGetServingMode);
    on<SetServingMode>(_onSetServingMode);
    on<ResetServingMode>(_onResetServingMode);
  }

  FutureOr<void> _onGetServingMode(
      GetServingMode event, Emitter<TakeAwayState> emit) async {
    ServingMode? mode = await _getServingMode();
    if (mode != null) {
      emit(ServingModeSelectedState(mode));
      // log.d('TakeAwayBloc.ServingModeSelectedState=$mode');
    } else {
      emit(NoServingModeSelectedState());
      // log.d('TakeAwayBloc.NoServingModeSelectedState');
    }
  }

  FutureOr<void> _onSetServingMode(
      SetServingMode event, Emitter<TakeAwayState> emit) async {
    await _setServingMode(event.servingMode);
    emit(ServingModeSelectedState(event.servingMode));
  }

  FutureOr<void> _onResetServingMode(
      ResetServingMode event, Emitter<TakeAwayState> emit) async {
    await _clearServingMode();
    emit(NoServingModeSelectedState());
  }

  Future<bool> _setServingMode(ServingMode mode) async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    await preferences.setString(KEY_SERVING_MODE, enumToString(mode)!);
    return true;
  }

  Future<ServingMode?> _getServingMode() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? modeString = preferences.getString(KEY_SERVING_MODE);
    return modeString == null
        ? null
        : enumFromStringNull(modeString, ServingMode.values);
  }

  Future<bool> _clearServingMode() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    return preferences.remove(KEY_SERVING_MODE);
  }
}
