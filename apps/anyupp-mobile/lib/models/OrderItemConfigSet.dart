import '/graphql/generated/crud-api.dart';
import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class OrderItemConfigSet {
  final String productSetId;
  final LocalizedItem name;
  final ProductComponentSetType type;
  final List<OrderItemConfigComponent> items;
  OrderItemConfigSet({
    required this.productSetId,
    required this.name,
    required this.type,
    required this.items,
  });

  OrderItemConfigSet copyWith({
    String? productSetId,
    LocalizedItem? name,
    ProductComponentSetType? type,
    List<OrderItemConfigComponent>? items,
  }) {
    return OrderItemConfigSet(
      productSetId: productSetId ?? this.productSetId,
      name: name ?? this.name,
      type: type ?? this.type,
      items: items ?? this.items,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productSetId': productSetId,
      'name': name.toJson(),
      'type': enumToString(type),
      'items': items.map((x) => x.toJson()).toList(),
    };
  }

  factory OrderItemConfigSet.fromJson(Map<String, dynamic> map) {
    return OrderItemConfigSet(
      productSetId: map['productSetId'],
      name: LocalizedItem.fromJson(map['name']),
      type: enumFromString(map['type'], ProductComponentSetType.values),
      items: List<OrderItemConfigComponent>.from(
          map['items']?.map((x) => OrderItemConfigComponent.fromJson(x))),
    );
  }

  @override
  String toString() {
    return 'OrderItemConfigSet(productSetId: $productSetId, name: $name, type: $type, items: $items)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is OrderItemConfigSet &&
        other.productSetId == productSetId &&
        other.name == name &&
        other.type == type &&
        listEquals(other.items, items);
  }

  @override
  int get hashCode {
    return productSetId.hashCode ^
        name.hashCode ^
        type.hashCode ^
        items.hashCode;
  }
}
