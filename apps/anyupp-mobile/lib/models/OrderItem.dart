import 'package:flutter/foundation.dart';
import 'package:fa_prev/models.dart';

class OrderItem {
  final String? id;
  final String productId;
  final String variantId;
  final LocalizedItem productName;
  final PriceShown priceShown;
  final PriceShown sumPriceShown;
  final int quantity;
  final List<StatusLog> statusLog;
  final LocalizedItem variantName;
  final String? image;
  final List<String>? allergens;
  final List<OrderItemConfigSet>? configSets;
  Map<OrderItemConfigSet, List<OrderItemConfigComponent>>? selectedConfigMap;

  OrderItem({
    this.id,
    required this.productId,
    required this.variantId,
    required this.productName,
    required this.priceShown,
    required this.sumPriceShown,
    required this.quantity,
    required this.statusLog,
    required this.variantName,
    this.image,
    this.allergens,
    this.configSets,
  });

  OrderItem copyWith({
    String? id,
    String? productId,
    String? variantId,
    LocalizedItem? productName,
    PriceShown? priceShown,
    PriceShown? sumPriceShown,
    int? quantity,
    List<StatusLog>? statusLog,
    LocalizedItem? variantName,
    String? image,
    List<String>? allergens,
    List<OrderItemConfigSet>? configSets,
  }) {
    return OrderItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      variantId: variantId ?? this.variantId,
      productName: productName ?? this.productName,
      priceShown: priceShown ?? this.priceShown,
      sumPriceShown: sumPriceShown ?? this.sumPriceShown,
      quantity: quantity ?? this.quantity,
      statusLog: statusLog ?? this.statusLog,
      variantName: variantName ?? this.variantName,
      image: image ?? this.image,
      allergens: allergens ?? this.allergens,
      configSets: configSets ?? this.configSets,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'variantId': variantId,
      'productName': productName.toJson(),
      'priceShown': priceShown.toJson(),
      'sumPriceShown': sumPriceShown.toJson(),
      'quantity': quantity,
      'statusLog': statusLog.map((x) => x.toJson()).toList(),
      'variantName': variantName.toJson(),
      'image': image,
      'allergens': allergens,
      'configSets': configSets?.map((x) => x.toJson()).toList(),
    };
  }

  factory OrderItem.fromJson(Map<String, dynamic> map) {
    return OrderItem(
      id: map['id'],
      productId: map['productId'],
      variantId: map['variantId'],
      productName: LocalizedItem.fromJson(map['productName']),
      priceShown: PriceShown.fromJson(map['priceShown']),
      sumPriceShown: PriceShown.fromJson(map['sumPriceShown']),
      quantity: map['quantity'],
      statusLog: List<StatusLog>.from(map['statusLog']?.map((x) => StatusLog.fromJson(x))),
      variantName: LocalizedItem.fromJson(map['variantName']),
      image: map['image'],
      allergens: map['allergens'] != null ? List<String>.from(map['allergens']) : null,
      configSets: map['configSets'] != null
          ? List<OrderItemConfigSet>.from(map['configSets']?.map((x) => OrderItemConfigSet.fromJson(x)))
          : null,
    );
  }

  @override
  String toString() {
    return 'OrderItem(id: $id, productId: $productId, variantId: $variantId, productName: $productName, priceShown: $priceShown, sumPriceShown: $sumPriceShown, quantity: $quantity, statusLog: $statusLog, variantName: $variantName, image: $image, allergens: $allergens, configSets: $configSets)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is OrderItem &&
        other.id == id &&
        other.productId == productId &&
        other.variantId == variantId &&
        other.productName == productName &&
        other.priceShown == priceShown &&
        other.sumPriceShown == sumPriceShown &&
        other.quantity == quantity &&
        listEquals(other.statusLog, statusLog) &&
        other.variantName == variantName &&
        other.image == image &&
        listEquals(other.allergens, allergens) &&
        listEquals(other.configSets, configSets);
  }

  @override
  int get hashCode {
    return id.hashCode ^
        productId.hashCode ^
        variantId.hashCode ^
        productName.hashCode ^
        priceShown.hashCode ^
        sumPriceShown.hashCode ^
        quantity.hashCode ^
        statusLog.hashCode ^
        variantName.hashCode ^
        image.hashCode ^
        allergens.hashCode ^
        configSets.hashCode;
  }
}
