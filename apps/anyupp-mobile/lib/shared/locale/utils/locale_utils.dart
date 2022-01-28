import 'package:fa_prev/models.dart';
import 'package:flutter/material.dart';

String getLocalizedText(BuildContext context, LocalizedItem localizedItem) {
  var locale = Localizations.localeOf(context).languageCode;
  switch (locale) {
    case 'hu':
      return localizedItem.hu ?? localizedItem.en ?? '-';
    case 'de':
      return localizedItem.de ?? localizedItem.en ?? '-';
    default:
      return localizedItem.en ?? '-';
  }
}
