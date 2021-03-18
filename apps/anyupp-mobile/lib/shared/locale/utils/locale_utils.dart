import 'package:flutter/material.dart';

import 'package:fa_prev/shared/locale.dart';

String getLocalizedText(BuildContext context, Map<String, String> localizedItem) {
  var defaultLocale = SupportedLocales.locales.first.languageCode;
  var locale = Localizations.localeOf(context).languageCode;
  if (localizedItem[locale] != null && localizedItem[locale] != '') {
    return localizedItem[locale];
  } else if (localizedItem[defaultLocale] != null && localizedItem[defaultLocale] != '') {
    return localizedItem[defaultLocale];
  } else {
    for (var item in localizedItem.values) {
      if (item != null && item != '') {
        return item;
      }
    }
  }

  return '';
}
