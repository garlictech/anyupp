import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

import 'dot_notate.dart';

class AppLocalizations {
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static Map<String, String> _translations;

  static Future<bool> load(Locale locale) async {
    // Load JSON
    String data = await rootBundle.loadString('assets/lang/${locale.languageCode}.json');

    // Parse data
    _translations = new Map();
    dotNotate(json.decode(data), _translations, '');

    // Init IntlLib
    // Make sure the locale name is in the right format e.g.
    // converting "en-US" to "en_US".
    final String canonicalLocaleName = Intl.canonicalizedLocale(locale.toString());
    // Force the locale in Intl.
    Intl.defaultLocale = canonicalLocaleName;
    await initializeDateFormatting(canonicalLocaleName, null);

    return true;
  }

  String trans(String key, [List<dynamic> params, String fallbackKey1, String fallbackKey2]) {
    if (params != null) {
      String trans = _translations[key] ?? _translations[fallbackKey1] ?? _translations[fallbackKey2] ?? key;
      for (var i = 0; i < params.length; i++) {
        trans = trans.replaceFirst('{{$i}}', params[i]?.toString());
      }
      return trans;
    }
    return _translations[key] ?? _translations[fallbackKey1] ?? _translations[fallbackKey2] ?? key;
  }
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['hu', 'en', 'de'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    AppLocalizations localizations = new AppLocalizations();
    await AppLocalizations.load(locale);

    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
