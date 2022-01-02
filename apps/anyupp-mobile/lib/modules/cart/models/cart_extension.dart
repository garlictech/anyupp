import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

extension CartExtension on Cart {
  int get orderCount => items.length;

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
    return value;
  }

  int variantCount(GeneratedProduct item, ProductVariant variant) {
    int index = items.indexWhere(
        (order) => order.productId == item.id && order.variantId == variant.id);
    return index != -1 ? items[index].quantity : 0;
  }

  bool get isPlaceEmpty => place?.isEmpty ?? true;

  double get packaginFee {
    if (servingMode != ServingMode.takeAway) {
      return 0.0;
    }

    double price = 0.0;
    items.forEach((orderItem) {
      price += (orderItem.netPackagingFee ?? 0) * orderItem.quantity;
      orderItem.selectedConfigMap?.forEach((key, comps) {
        for (int i = 0; i < comps.length; i++) {
          price += (comps[i].netPackagingFee ?? 0) * orderItem.quantity;
        }
      });
    });
    return price;
  }
}
