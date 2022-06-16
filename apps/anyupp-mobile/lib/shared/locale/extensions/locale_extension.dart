import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';

extension TranslateStateExtension on State {
  String trans(String key,
      [List<dynamic>? params, String? fallbackKey1, String? fallbackKey2]) {
    return AppLocalizations.of(this.context)!
        .trans(key, params, fallbackKey1, fallbackKey2);
  }
}

extension TranslateStatelessWidgetExtension on StatelessWidget {
  String trans(BuildContext context, String key,
      [List<dynamic>? params, String? fallbackKey1, String? fallbackKey2]) {
    return AppLocalizations.of(context)!
        .trans(key, params, fallbackKey1, fallbackKey2);
  }
}

String transEx(BuildContext context, String key,
    [List<dynamic>? params, String? fallbackKey1, String? fallbackKey2]) {
  return AppLocalizations.of(context)!
      .trans(key, params, fallbackKey1, fallbackKey2);
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }

  String toCapitalized() =>
      length > 0 ? '${this[0].toUpperCase()}${substring(1).toLowerCase()}' : '';

  String toTitleCase() => replaceAll(RegExp(' +'), ' ')
      .split(' ')
      .map((str) => str.toCapitalized())
      .join(' ');
}
