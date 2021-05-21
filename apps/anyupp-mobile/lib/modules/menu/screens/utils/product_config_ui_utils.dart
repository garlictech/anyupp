import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';

class ConfigType {
  static const String MODIFIER =  'product_modifier';
  static const String EXTRA =  'product_extras';
}

String getDetailsTextFromModifierSet(BuildContext context, GeneratedProductConfigSet modifier) {
  StringBuffer sb = StringBuffer();
  for (int i = 0; i < modifier.items.length; i++) {
    sb.write(getLocalizedText(context, modifier.items[i].name));
    if (i < modifier.items.length - 1) {
      sb.write(' + ');
    }
  }
  return sb.toString(); //'#' + getLocalizedText(context, modifier.name);
}

Widget buildAllergensListWidget(BuildContext context, GeneratedProductConfigSet configSet) {
  Set<String> allergeens = {};
  for (int i = 0; i < configSet.items.length; i++) {
    GeneratedProductConfigComponent component = configSet.items[i];
    if (component.allergens != null) {
      component.allergens.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
    }
  }

  return Container(
    child: AllergensWidget(
      allergens: allergeens.toList(),
      size: 40.0,
      fontSize: 10.0,
      iconBorderRadius: 10.0,

    ),
  );
}

String getModifierItemsTotalPrice(GeneratedProductConfigSet modifier, String currency) {

  double price = 0;
  modifier.items.forEach((item) { price += item.price; });
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

String formatCurrencyWithSignal(double price, String currency) {
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

GeneratedProductConfigSet getModifierConfigSetByPosition(int position, List<GeneratedProductConfigSet> sets) {
  int index = sets.indexWhere((configSet) => configSet.type == ConfigType.MODIFIER && configSet.position == position);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigSet getExtraConfigSetByPosition(int position, List<GeneratedProductConfigSet> sets) {
  int index = sets.indexWhere((configSet) => configSet.type == ConfigType.EXTRA && configSet.position == position);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigComponent getComponentByPositionFromSet(int position, GeneratedProductConfigSet configSet) {
  if (configSet != null && configSet.items != null) {
    int index = configSet.items.indexWhere((item) => item.position == position);
    if (index != -1) {
      return configSet.items[index];
    }
  }

  return null;
}
