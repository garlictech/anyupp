import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';

class ConfigType {
  static const String MODIFIER = 'modifier';
  static const String EXTRA = 'extras';
}

// String getDetailsTextFromModifierComponent(BuildContext context, GeneratedProductConfigComponent modifier) {
//   StringBuffer sb = StringBuffer();
//   for (int i = 0; i < modifier.items.length; i++) {
//     sb.write(getLocalizedText(context, modifier.items[i].name));
//     if (i < modifier.items.length - 1) {
//       sb.write(' + ');
//     }
//   }
//   return sb.toString(); //'#' + getLocalizedText(context, modifier.name);
// }

String getModifierItemsTotalPrice(GeneratedProductConfigSet modifier, String currency) {
  double price = 0;
  modifier.items.forEach((item) {
    price += item.price;
  });
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

String formatCurrencyWithSignal(double price, String currency) {
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

GeneratedProductConfigSet getModifierConfigSetById(String productSetId, List<GeneratedProductConfigSet> sets) {
  // print('getModifierConfigSetById()=$productSetId');
  int index =
      sets.indexWhere((configSet) => configSet.type == ConfigType.MODIFIER && configSet.productSetId == productSetId);
  // print('getModifierConfigSetById().indec=$index');
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigSet getExtraConfigSetById(String extraSetId, List<GeneratedProductConfigSet> sets) {
  int index =
      sets.indexWhere((configSet) => configSet.type == ConfigType.EXTRA && configSet.productSetId == extraSetId);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigComponent getComponentByIdFromSet(String componentId, GeneratedProductConfigSet configSet) {
  if (configSet != null && configSet.items != null) {
    int index = configSet.items.indexWhere((item) => item.productComponentId == componentId);
    if (index != -1) {
      return configSet.items[index];
    }
  }
  return null;
}

GeneratedProductConfigComponent getExtraComponentByIdAndSetId(
    String extraSetId, String componentId, List<GeneratedProductConfigSet> configSets) {
  GeneratedProductConfigSet configSet = getExtraConfigSetById(extraSetId, configSets);
  if (configSet != null) {
    return getComponentByIdFromSet(componentId, configSet);
  }
  return null;
}

class CalculatePriceInput {
  final Map<String, String> selectedModifiers;
  final Map<String, Map<String, bool>> selectedExtras;
  final List<GeneratedProductConfigSet> configSets;

  CalculatePriceInput({this.selectedModifiers, this.selectedExtras, this.configSets});
}

double calculateTotalPrice(CalculatePriceInput input) {
  double price = 0;

  //--- calculate modifier price
  input.selectedModifiers.forEach((key, value) {
    GeneratedProductConfigSet modifier = getModifierConfigSetById(key, input.configSets);
    // print('_calculateTotalPrice.modifier=${modifier?.name?.hu}');
    if (modifier != null) {
      GeneratedProductConfigComponent component = getComponentByIdFromSet(value, modifier);
      // print('_calculateTotalPrice.component=${component?.name?.hu}: ${component?.price}');
      price += component?.price ?? 0;
    }
  });

  input.selectedExtras.forEach((setId, setMap) {
    setMap.forEach((componentId, selected) {
      if (selected == true) {
        GeneratedProductConfigComponent component = getExtraComponentByIdAndSetId(setId, componentId, input.configSets);
        price += component?.price ?? 0;
      }
    });
  });

  return price;
}
