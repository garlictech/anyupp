import '/models.dart';
import 'package:flutter/material.dart';

String getLocalizedText(BuildContext context, LocalizedItem localizedItem) {
  var locale = Localizations.localeOf(context).languageCode;
  switch (locale) {
    case 'hu':
      return _getTextByOrder(
          localizedItem.hu, [localizedItem.en, localizedItem.de]);
    case 'de':
      return _getTextByOrder(
          localizedItem.de, [localizedItem.en, localizedItem.hu]);
    default:
      return _getTextByOrder(
          localizedItem.en, [localizedItem.hu, localizedItem.de]);
  }
}

String _getTextByOrder(String? primary, [List<String?>? fallback]) {
  if (_isNotEmpty(primary)) {
    return primary!;
  }
  int? index = fallback?.indexWhere((element) => _isNotEmpty(element));
  if (index != null && index >= 0) {
    return fallback![index]!;
  }
  return '-';
}

bool _isNotEmpty(String? s) => s?.isNotEmpty == true;
