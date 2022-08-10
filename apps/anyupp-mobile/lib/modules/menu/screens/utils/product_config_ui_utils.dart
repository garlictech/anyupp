import '/models.dart';
import '/shared/utils/format_utils.dart';
import '/graphql/generated/crud-api.dart';

// class ConfigType {
//   static const String MODIFIER = 'modifier';
//   static const String EXTRA = 'extras';
// }

String getModifierItemsTotalPrice(
    ProductConfigSet modifier, String currency) {
  double price = 0;
  modifier.items.forEach((item) {
    price += item.price;
  });
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

String formatCurrencyWithSignal(double price, String currency) {
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

ProductConfigSet? getModifierConfigSetById(
    String productSetId, List<ProductConfigSet> sets) {
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

ProductConfigSet? getExtraConfigSetById(
    String extraSetId, List<ProductConfigSet> sets) {
  int index = sets.indexWhere((configSet) =>
      configSet.type == ProductComponentSetType.extras &&
      configSet.productSetId == extraSetId);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

ProductConfigComponent? getComponentByIdFromSet(
  String componentId,
  ProductConfigSet? configSet,
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

ProductConfigComponent? getExtraComponentByIdAndSetId(
  String extraSetId,
  String componentId,
  List<ProductConfigSet> configSets,
  ServingMode? mode,
) {
  ProductConfigSet? configSet =
      getExtraConfigSetById(extraSetId, configSets);
  if (configSet != null && configSet.supportedServingModes.contains(mode)) {
    return getComponentByIdFromSet(componentId, configSet, mode);
  }
  return null;
}

class CalculatePriceInput {
  final Map<String, String> selectedModifiers;
  final Map<String, Map<String, bool>> selectedExtras;
  final List<ProductConfigSet> configSets;

  CalculatePriceInput(
      {required this.selectedModifiers,
      required this.selectedExtras,
      required this.configSets});
}

double calculateTotalPrice(
  Product product,
  ServingMode? servingMode,
  ProductVariant? _productVariant,
  Map<String, Map<String, bool>> selectedExtras,
  Map<String, String> selectedModifiers,
) {
  double price = _productVariant?.price ?? 0;

  //--- calculate modifier price
  selectedModifiers.forEach((key, value) {
    ProductConfigSet? modifier =
        getModifierConfigSetById(key, product.configSets ?? []);
    ProductConfigComponent? component = getComponentByIdFromSet(
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
        ProductConfigComponent? component =
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
