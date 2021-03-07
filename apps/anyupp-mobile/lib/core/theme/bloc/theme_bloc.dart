import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:catcher/core/catcher.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/color.dart';
import 'package:flutter/material.dart';

part 'theme_event.dart';
part 'theme_state.dart';

// !!! THEME_ANY_UPP is the DEFAULT theme

class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  final UnitSelectBloc _unitSelectBloc;
  StreamSubscription _unitSelectSubscription;

  ThemeBloc(this._unitSelectBloc) : super(ThemeState(theme: ThemeAnyUpp())) {
    _unitSelectSubscription = _unitSelectBloc.asBroadcastStream().listen((unitSelectedState) {
      if (unitSelectedState is UnitSelected) {
        add(ThemeSelected(theme: unitThemeToThemeChainData(unitSelectedState.unit)));
      }
    });
  }

  @override
  Stream<ThemeState> mapEventToState(ThemeEvent event) async* {
    if (event is ThemeSelected) {
      yield ThemeState(theme: event.theme);
    }
  }

  @override
  Future<void> close() {
    _unitSelectSubscription.cancel();
    return super.close();
  }
}

ThemeChainData unitThemeToThemeChainData(GeoUnit unit) {
  if (unit.style == null) {
    return ThemeAnyUpp();
  }
  try {
    return ThemeChainData(
      background: HexColor.fromHex(unit.style.colors.backgroundLight),
      background2: HexColor.fromHex(unit.style.colors.backgroundDark),
      text: HexColor.fromHex(unit.style.colors.textDark),
      text2: HexColor.fromHex(unit.style.colors.textLight),
      indicator: HexColor.fromHex(unit.style.colors.indicator),
      highlight: HexColor.fromHex(unit.style.colors.highlight),
      disabled: HexColor.fromHex(unit.style.colors.disabled),
      border: HexColor.fromHex(unit.style.colors.borderDark),
      border2: HexColor.fromHex(unit.style.colors.borderLight),
      images: unit.style.images,
    );
  } catch (error, stackTrace) {
    Catcher.reportCheckedError(error, stackTrace);
    return ThemeAnyUpp();
  }
}
