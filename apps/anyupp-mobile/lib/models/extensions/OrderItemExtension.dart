import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';

extension OrderItemExtension on OrderItem {
  double getPrice() {
    double sum = priceShown.pricePerUnit;
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent
            in value) {
          sum += generatedProductConfigComponent.price;
        }
      });
    }
    sum *= serviceFeeMul;
    return sum;
  }

  Map<String, List<String>> getConfigIdMap() {
    Map<String, List<String>> idMap = {};
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, value) {
        idMap[key.productSetId] =
            value.map((e) => e.productComponentId).toList();
      });
    }
    return idMap;
  }
}
