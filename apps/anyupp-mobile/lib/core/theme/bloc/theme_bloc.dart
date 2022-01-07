import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';

part 'theme_event.dart';
part 'theme_state.dart';
// !!! THEME_ANY_UPP is the DEFAULT theme

class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  final UnitSelectBloc _unitSelectBloc;
  late StreamSubscription _unitSelectSubscription;

  ThemeBloc(this._unitSelectBloc) : super(ThemeState(theme: ThemeAnyUpp())) {
    on<ThemeSelected>(_onThemeSelected);
    _unitSelectSubscription =
        _unitSelectBloc.stream.asBroadcastStream().listen((unitSelectedState) {
      print('****** ThemeBloc._unitSelectSubscription=$unitSelectedState');
      if (unitSelectedState is UnitSelected) {
        add(ThemeSelected(
            theme: unitThemeToThemeChainData(unitSelectedState.unit)));
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
}
