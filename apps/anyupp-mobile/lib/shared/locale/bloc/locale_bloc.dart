import 'dart:async';
import 'dart:io';

import '/core/core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '/shared/locale.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleBloc extends Bloc<LocaleEvent, LocaleState> {
  LocaleBloc() : super(NoLocal()) {
    _initLocaleFromStorage();
    on<SetLocale>(_onSetLocale);
  }

  Future<void> _initLocaleFromStorage() async {
    SharedPreferences sp = await SharedPreferences.getInstance();
    String? language_code = sp.getString('LANGUAGE_CODE');
    String? country_code = sp.getString('COUNTRY_CODE');
    if (language_code == null || country_code == null) {
      final String defaultLocale = Platform.localeName;
      Locale locale = Locale('en', 'EN');
      if (defaultLocale.startsWith('hu')) {
        locale = Locale('hu', 'HU');
      }
      log.d('LocaleBloc.set.defaultLocale()=$locale');
      add(SetLocale(locale));
    } else {
      add(SetLocale(Locale(language_code, country_code)));
    }
  }

  FutureOr<void> _onSetLocale(
      SetLocale event, Emitter<LocaleState> emit) async {
    log.d('LocaleBloc._onSetLocale()=${event.locale}');
    SharedPreferences sp = await SharedPreferences.getInstance();
    if (event.locale != null) {
      await sp.setString('LANGUAGE_CODE', event.locale!.languageCode);
      await sp.setString('COUNTRY_CODE', event.locale!.countryCode ?? '');
    }
    emit(LocaleSelected(event.locale));
  }
}
