import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';

String getLocalizedText(BuildContext context, LocalizedItem localizedItem) {
  var locale = Localizations.localeOf(context).languageCode;
  switch (locale) {
    case 'hu':
      return _getTextByOrder(localizedItem.hu, localizedItem.en);
    case 'de':
      return _getTextByOrder(localizedItem.de, localizedItem.en);
    default:
      return _getTextByOrder(localizedItem.en);
  }
}

String _getTextByOrder(String? primary, [String? fallback]) =>
    _isNotEmpty(primary)
        ? primary!
        : _isNotEmpty(fallback)
            ? fallback!
            : '-';

bool _isNotEmpty(String? s) => s?.isNotEmpty == true;
