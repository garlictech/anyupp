import 'package:fa_prev/models.dart';

extension OrderItemExtension on OrderItem {
  double getPrice() {
    double sum = priceShown.pricePerUnit;
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          sum += generatedProductConfigComponent.price;
        }
      });
    }
    return sum;
  }

  Map<String, List<String>> getConfigIdMap() {
    Map<String, List<String>> idMap = {};
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, value) {
        idMap[key.productSetId] = value.map((e) => e.productComponentId).toList();
      });
    }
    return idMap;
  }
}
