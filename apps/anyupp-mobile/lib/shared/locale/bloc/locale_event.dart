import 'package:flutter/material.dart';

abstract class LocaleEvent {
  const LocaleEvent();
}

class SetLocale extends LocaleEvent {
  final Locale? _locale;

  const SetLocale([this._locale]);

  Locale? get locale => _locale;
}
