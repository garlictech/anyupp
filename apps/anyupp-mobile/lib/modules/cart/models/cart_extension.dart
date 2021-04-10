import 'package:fa_prev/models.dart';

extension CartExtension on Cart {
  int get orderCount => items?.length ?? 0;

  int get totalCount {
    int count = 0;
    items.forEach((order) => count += order.quantity);
    return count;
  }

  double get totalPrice {
    double value = 0;
    items.forEach((order) => value += (order.priceShown.pricePerUnit * order.quantity));
    return value;
  }

  int variantCount(GeneratedProduct item, ProductVariant variant) {
    int index = items == null
        ? -1
        : items.indexWhere((order) => order.productId == item.id && order.variantId == variant.id);
    return index != -1 ? items[index].quantity : 0;
  }
}

// import 'dart:convert';

// import 'package:fa_prev/models.dart';

// class Cart {
//   // Attributes
//   final Order order;
//   // final List<OrderItem> orders;

//   // Customer's place in the Unit (Table + Seat)
//   Place place;

//   // Constructor
//   Cart({
//     this.order,
//     this.place,
//   });

//   int get orderCount => order?.items?.length ?? 0;

//   int get totalCount {
//     int count = 0;
//     order.items.forEach((order) => count += order.quantity);
//     return count;
//   }

//   double get totalPrice {
//     double value = 0;
//     order.items.forEach((order) => value += order.priceShown.pricePerUnit);
//     return value;
//   }

//   int variantCount(GeneratedProduct item, ProductVariant variant) {
//     int index = order?.items == null
//         ? -1
//         : order.items.indexWhere((order) => order.productId == item.id && order.variantId == variant.id);
//     return index != -1 ? order.items[index].quantity : 0;
//   }

//   Map<String, dynamic> toMap() {
//     return {
//       'orders': order.items?.map((x) => x?.toJson())?.toList(),
//       'place': place?.toJson(),
//     };
//   }

//   static Cart fromMap(Map<dynamic, dynamic> map) {
//     if (map == null || map['orders'] == null) return null;

//     return Cart(
//       order: map['order'] != null ? Order.fromJson(Map<String, dynamic>.from(map['order'])): null,
//       place: map['place'] != null ? Place.fromJson(Map<String, dynamic>.from(map['place'])) : null,
//     );
//   }

//   String toJson() => json.encode(toMap());

//   static Cart fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() => 'Cart(order: $order, items: ${order?.items}, place: $place)';
// }
