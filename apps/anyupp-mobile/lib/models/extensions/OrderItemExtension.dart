import 'package:fa_prev/models.dart';

extension OrderItemExtension on OrderItem {
  double getPrice() {
    double sum = priceShown.pricePerUnit;
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, List<OrderItemConfigComponent> value) {
        for (OrderItemConfigComponent generatedProductConfigComponent in value) {
          sum += generatedProductConfigComponent.price;
        }
      });
    }
    return sum;
  }

  Map<String, List<String>> getConfigIdMap() {
    Map<String, List<String>> idMap = {};
    if (selectedConfigMap != null) {
      selectedConfigMap?.forEach((key, value) {
        idMap[key.productSetId] = value.map((e) => e.productComponentId).toList();
      });
    }
    return idMap;
  }

  Map<OrderItemConfigSet, List<OrderItemConfigComponent>> getSelectdConfigMap() {
    Map<OrderItemConfigSet, List<OrderItemConfigComponent>> selectedConfigMap = {};
    if (configSets == null) {
      return selectedConfigMap;
    }

    if (configSets != null) {
      for (int i = 0; i < configSets!.length; i++) {
        OrderItemConfigSet configSet = configSets![i];
        selectedConfigMap[configSet] = configSet.items;
      }
    }
    return selectedConfigMap;
  }
}
