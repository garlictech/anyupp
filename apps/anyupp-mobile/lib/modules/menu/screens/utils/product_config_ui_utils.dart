import '/models.dart';
import '/shared/utils/format_utils.dart';
import '/graphql/generated/crud-api.dart';

// class ConfigType {
//   static const String MODIFIER = 'modifier';
//   static const String EXTRA = 'extras';
// }

String getModifierItemsTotalPrice(
    GeneratedProductConfigSet modifier, String currency) {
  double price = 0;
  modifier.items.forEach((item) {
    price += item.price;
  });
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

String formatCurrencyWithSignal(double price, String currency) {
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

GeneratedProductConfigSet? getModifierConfigSetById(
    String productSetId, List<GeneratedProductConfigSet> sets) {
  // log.d('getModifierConfigSetById()=$productSetId');
  int index = sets.indexWhere((configSet) =>
      configSet.type == ProductComponentSetType.modifier &&
      configSet.productSetId == productSetId);
  // log.d('getModifierConfigSetById().indec=$index');
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigSet? getExtraConfigSetById(
    String extraSetId, List<GeneratedProductConfigSet> sets) {
  int index = sets.indexWhere((configSet) =>
      configSet.type == ProductComponentSetType.extras &&
      configSet.productSetId == extraSetId);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

GeneratedProductConfigComponent? getComponentByIdFromSet(
  String componentId,
  GeneratedProductConfigSet? configSet,
  ServingMode? mode,
) {
  if (configSet != null && configSet.items.isNotEmpty) {
    int index = configSet.items
        .indexWhere((item) => item.productComponentId == componentId);
    if (index != -1 && configSet.supportedServingModes.contains(mode)) {
      return configSet.items[index];
    }
  }
  return null;
}

GeneratedProductConfigComponent? getExtraComponentByIdAndSetId(
  String extraSetId,
  String componentId,
  List<GeneratedProductConfigSet> configSets,
  ServingMode? mode,
) {
  GeneratedProductConfigSet? configSet =
      getExtraConfigSetById(extraSetId, configSets);
  if (configSet != null && configSet.supportedServingModes.contains(mode)) {
    return getComponentByIdFromSet(componentId, configSet, mode);
  }
  return null;
}

class CalculatePriceInput {
  final Map<String, String> selectedModifiers;
  final Map<String, Map<String, bool>> selectedExtras;
  final List<GeneratedProductConfigSet> configSets;

  CalculatePriceInput(
      {required this.selectedModifiers,
      required this.selectedExtras,
      required this.configSets});
}

double calculateTotalPrice(
  GeneratedProduct product,
  ServingMode? servingMode,
  ProductVariant? _productVariant,
  Map<String, Map<String, bool>> selectedExtras,
  Map<String, String> selectedModifiers,
) {
  double price = _productVariant?.price ?? 0;

  //--- calculate modifier price
  selectedModifiers.forEach((key, value) {
    GeneratedProductConfigSet? modifier =
        getModifierConfigSetById(key, product.configSets ?? []);
    GeneratedProductConfigComponent? component = getComponentByIdFromSet(
      value,
      modifier,
      servingMode,
    );
    bool isSupported =
        modifier?.supportedServingModes.contains(servingMode) ?? false;

    if (isSupported) {
      price += component?.price ?? 0;
    }
  });

  selectedExtras.forEach((setId, setMap) {
    setMap.forEach((componentId, selected) {
      if (selected == true) {
        GeneratedProductConfigComponent? component =
            getExtraComponentByIdAndSetId(
          setId,
          componentId,
          product.configSets ?? [],
          servingMode,
        );
        if (component != null) {
          price += component.price;
        }
      }
    });
  });
  // log.d('calculateTotalPrice.price=${price}');
  return price;
}
