import 'package:flutter/material.dart';

@immutable
abstract class LocaleState {
  const LocaleState();
}

class NoLocal extends LocaleState {}

class LocaleSelected extends LocaleState {
  final Locale locale;
  const LocaleSelected(this.locale);
}
