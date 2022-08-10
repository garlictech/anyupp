import '/models.dart';
import '/shared/utils/unit_utils.dart';

extension OrderItemExtension on OrderItem {
  double getPrice(ServiceFeePolicy? policy) {
    double sum = priceShown.pricePerUnit;
    if (selectedConfigMap != null) {
      selectedConfigMap!.forEach((key, value) {
        for (ProductConfigComponent generatedProductConfigComponent
            in value) {
          sum += generatedProductConfigComponent.price;
        }
      });
    }
    sum *= serviceFeeMulOrder(policy);
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
