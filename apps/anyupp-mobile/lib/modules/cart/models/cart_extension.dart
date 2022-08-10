import '/models.dart';
import '/graphql/generated/crud-api.dart';
import '/shared/utils/unit_utils.dart';

extension CartExtension on Cart {
  int get totalCount {
    int count = 0;
    items.forEach((order) => count += order.quantity);
    return count;
  }

  double get totalPrice {
    double value = 0;
    items.forEach((order) {
      double orderPrice = order.priceShown.pricePerUnit;
      if (order.selectedConfigMap != null) {
        order.selectedConfigMap?.forEach((key, comps) {
          for (int i = 0; i < comps.length; i++) {
            orderPrice += comps[i].price;
          }
        });
      }
      orderPrice *= order.quantity;
      value += orderPrice;
    });
    value += packaginFee;
    // value *= serviceFeeMul;
    value += totalServiceFee ?? 0;
    return value;
  }

  int variantCount(Product item, ProductVariant variant) {
    int index = items.indexWhere(
        (order) => order.productId == item.id && order.variantId == variant.id);
    return index != -1 ? items[index].quantity : 0;
  }

  bool get isPlaceEmpty => place?.isEmpty ?? true;

  double get packaginFee {
    if (servingMode != ServingMode.takeAway) {
      return 0.0;
    }

    double tax = currentUnit?.packagingTax ?? 0.0;

    double price = 0.0;
    items.forEach((orderItem) {
      price += ((orderItem.netPackagingFee ?? 0) * (1.0 + (tax / 100.0))) *
          orderItem.quantity;
      orderItem.selectedConfigMap?.forEach((key, comps) {
        for (int i = 0; i < comps.length; i++) {
          price += ((comps[i].netPackagingFee ?? 0) * (1.0 + (tax / 100.0))) *
              orderItem.quantity;
        }
      });
    });
    return price.round().toDouble();
  }

  double? get totalServiceFee {
    ServiceFeePolicy? policy = currentUnit?.serviceFeePolicy;

    if (policy == null || this.servingMode == ServingMode.takeAway) {
      return null;
    }

    double price = 0.0;
    items.forEach((order) {
      double orderPrice = order.priceShown.pricePerUnit;
      if (order.selectedConfigMap != null) {
        order.selectedConfigMap?.forEach((key, comps) {
          for (int i = 0; i < comps.length; i++) {
            orderPrice += comps[i].price;
          }
        });
      }
      orderPrice *= order.quantity;
      price += orderPrice;
    });
    price = price * (policy.percentage / 100.0);
    return price;
  }
}
