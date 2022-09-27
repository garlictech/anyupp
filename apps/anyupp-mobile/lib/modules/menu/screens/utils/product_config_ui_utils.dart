import '/models.dart';
import '/shared/utils/format_utils.dart';
import '/graphql/generated/crud-api.dart';

// class ConfigType {
//   static const String MODIFIER = 'modifier';
//   static const String EXTRA = 'extras';
// }

String getModifierItemsTotalPrice(ProductConfigSet modifier, String currency) {
  double price = 0;
  modifier.items.forEach((item) {
    price += item.price;
  });
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

String formatCurrencyWithSignal(double price, String currency) {
  return (price >= 0 ? '+' : '-') + formatCurrency(price, currency);
}

ProductComponentSet? getModifierComponentSetById(
    String productSetId, List<ProductComponentSet> sets) {
  int index = sets.indexWhere((configSet) =>
      configSet.type == ProductComponentSetType.modifier &&
      configSet.id == productSetId);

  if (index != -1) {
    return sets[index];
  }
  return null;
}

ProductComponentSet? getExtraComponentSetById(
    String extraSetId, List<ProductComponentSet> sets) {
  int index = sets.indexWhere((configSet) =>
      configSet.type == ProductComponentSetType.extras &&
      configSet.id == extraSetId);
  if (index != -1) {
    return sets[index];
  }
  return null;
}

ProductConfigComponent? getComponentByIdFromSet(
  String componentId,
  ProductConfigSet? configSet,
  ProductComponentSet? componentSet,
  ServingMode? mode,
) {
  if (configSet != null && componentSet != null && configSet.items.isNotEmpty) {
    int index = configSet.items
        .indexWhere((item) => item.productComponentId == componentId);
    if (index != -1 &&
        (componentSet.supportedServingModes?.contains(mode) ?? false)) {
      return configSet.items[index];
    }
  }
  return null;
}

ProductConfigComponent? getExtraComponentByIdAndSetId(
  String extraSetId,
  String componentId,
  List<ProductConfigSet> configSets,
  List<ProductComponentSet> componentSets,
  ServingMode? mode,
) {
  ProductComponentSet? componentSet =
      getExtraComponentSetById(extraSetId, componentSets);

  try {
    ProductConfigSet? configSet =
        configSets.firstWhere((set) => set.productSetId == componentId);

    if (componentSet != null &&
        (componentSet.supportedServingModes?.contains(mode) ?? false)) {
      return getComponentByIdFromSet(
          componentId, configSet, componentSet, mode);
    }

    return null;
  } catch (_) {
    return null;
  }
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
  List<ProductComponentSet> componentSets,
) {
  double price = _productVariant?.price ?? 0;

  //--- calculate modifier price
  selectedModifiers.forEach((key, value) {
    ProductComponentSet? modifier =
        getModifierComponentSetById(key, componentSets);
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
        ProductConfigComponent? component = getExtraComponentByIdAndSetId(
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
