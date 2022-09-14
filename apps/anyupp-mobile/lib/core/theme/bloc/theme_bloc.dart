import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/core/core.dart';

part 'theme_event.dart';
part 'theme_state.dart';
// !!! THEME_ANY_UPP is the DEFAULT theme

class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  final UnitSelectBloc _unitSelectBloc;
  late StreamSubscription _unitSelectSubscription;

  ThemeBloc(this._unitSelectBloc) : super(ThemeState(theme: ThemeAnyUpp())) {
    on<ThemeSelected>(_onThemeSelected);
    on<ResetTheme>(_onResetTheme);
    _unitSelectSubscription =
        _unitSelectBloc.stream.asBroadcastStream().listen((unitSelectedState) {
      log.d('****** ThemeBloc._unitSelectSubscription=$unitSelectedState');
      if (unitSelectedState is UnitSelected) {
        add(ThemeSelected(
            theme: unitThemeToThemeChainData(unitSelectedState.unit)));
      }
      if (unitSelectedState is NoUnitSelected) {
        add(ThemeSelected(theme: defaultTheme()));
      }
    });
  }

  @override
  Future<void> close() {
    _unitSelectSubscription.cancel();
    return super.close();
  }

  FutureOr<void> _onThemeSelected(
      ThemeSelected event, Emitter<ThemeState> emit) {
    emit(ThemeState(theme: event.theme));
  }

  FutureOr<void> _onResetTheme(ResetTheme event, Emitter<ThemeState> emit) {
    emit(ThemeState(theme: defaultTheme()));
  }
}
