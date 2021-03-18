import 'dart:convert';

import 'package:fa_prev/shared/models.dart';

class Cart {
  // Attributes
  final List<Order> orders;

  // Customer's place in the Unit (Table + Seat)
  Place place;

  // Constructor
  Cart({
    this.orders,
    this.place,
  });

  int get orderCount => orders != null ? orders.length : 0;

  int get totalCount {
    int count = 0;
    orders.forEach((order) => count += order.quantity);
    return count;
  }

  double get totalPrice {
    double value = 0;
    orders.forEach((order) => value += order.price);
    return value;
  }

  int variantCount(Product item, Variant variant) {
    int index = orders == null
        ? -1
        : orders.indexWhere((order) => order.product.id == item.id && order.variant.id == variant.id);
    return index != -1 ? orders[index].quantity : 0;
  }

  Map<String, dynamic> toMap() {
    return {
      'orders': orders?.map((x) => x?.toMap())?.toList(),
      'place': place?.toMap(),
    };
  }

  static Cart fromMap(Map<dynamic, dynamic> map) {
    if (map == null || map['orders'] == null) return null;

    return Cart(
      orders: List<dynamic>.from(map['orders']).map((e) => Order.fromMap(Map<String, dynamic>.from(e))).toList(),
      place: map['place'] != null ? Place.fromMap(Map<String, dynamic>.from(map['place'])) : null,
      // place: map['place'] != null
      //     ? Place.fromMap(Map<String, dynamic>.from(map['place']))
      //     : Place('00', '00'), // default place
    );
  }

  String toJson() => json.encode(toMap());

  static Cart fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() => 'Cart(orders: $orders, place: $place)';
}
