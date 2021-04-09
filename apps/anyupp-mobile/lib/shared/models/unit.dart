import 'dart:convert';

import 'package:fa_prev/models.dart';

// import 'address.dart';
// import 'payment.dart';
// import 'product.dart';

// class Unit {
//   // TODO: do we use these?
//   String name;
//   String email;
//   String phone;
//   Address address;
//   Map<String, Payment> payment;
//   String description;
//   GeneratedProduct products;
//   Map<String, bool> services;
//   Map<String, String> schedule;
//   String image;
//   Map<String, Table> tables;
//   Map<String, QueueOrder> queue;

//   Unit({
//     this.email,
//     this.phone,
//     this.address,
//     this.payment,
//     this.description,
//     this.products,
//     this.services,
//     this.schedule,
//     this.image,
//     this.tables,
//     this.queue,
//   });
// }

// class Table {
//   String id;
//   Map<String, Seat> seats;
// }

// class Seat {
//   String id;
//   Map<String, Order> orders;
//   String user;

//   Seat({this.orders, this.user});
// }

// class QueueOrder {
//   String id;
//   Map<String, Order> orders;
//   String user;

//   QueueOrder({this.orders, this.user});
// }

class Order {
  String id;
  GeneratedProduct product;
  ProductVariant variant;
  int quantity = 1;
  Order(
    this.id,
    this.product,
    this.variant,
    this.quantity,
  );
  double get price => (variant.price * quantity);

  Order copyWith({
    String id,
    GeneratedProduct product,
    ProductVariant variant,
    int quantity,
  }) {
    return Order(
      id ?? this.id,
      product ?? this.product,
      variant ?? this.variant,
      quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'product': product?.toJson(),
      'variant': variant?.toJson(),
      'quantity': quantity,
    };
  }

  static Order fromMap(Map<String, dynamic> map) {
    if (map == null) return null;
    return Order(
      map['id'].toString(),
      GeneratedProduct.fromJson(Map<String, dynamic>.from(map['product'])),
      ProductVariant.fromJson(Map<String, dynamic>.from(map['variant'])),
      map['quantity'],
    );
  }

  String toJson() => json.encode(toMap());

  static Order fromJson(String source) => fromMap(json.decode(source));

  @override
  String toString() {
    return 'Order(id: $id, product: $product, variant: $variant, quantity: $quantity)';
  }
}
