import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';

@immutable
class Cart {
  final String? id;
  final String userId;
  final String unitId;
  final Place? place;
  final PaymentMode? paymentMode;
  final List<OrderItem> items;
  final ServingMode servingMode;

  Cart({
    this.id,
    required this.userId,
    required this.unitId,
    this.place,
    this.paymentMode,
    required this.items,
    required this.servingMode,
  });

  Cart copyWith({
    String? id,
    String? userId,
    String? unitId,
    Place? place,
    PaymentMode? paymentMode,
    List<OrderItem>? items,
    ServingMode? servingMode,
  }) {
    return Cart(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      unitId: unitId ?? this.unitId,
      place: place ?? this.place,
      paymentMode: paymentMode ?? this.paymentMode,
      items: items ?? this.items,
      servingMode: servingMode ?? this.servingMode,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'unitId': unitId,
      'place': place?.toJson(),
      'paymentMode': paymentMode?.toJson(),
      'items': items.map((x) => x.toJson()).toList(),
      'servingMode': enumToString(servingMode),
    };
  }

  factory Cart.fromJson(Map<String, dynamic> map) {
    return Cart(
      id: map['id'],
      userId: map['userId'],
      unitId: map['unitId'],
      place: map['place'] != null ? Place.fromJson(map['place']) : null,
      paymentMode: map['paymentMode'] != null ? PaymentMode.fromJson(map['paymentMode']) : null,
      items: List<OrderItem>.from(map['items']?.map((x) => OrderItem.fromJson(x))),
      servingMode: enumFromString<ServingMode>(map['servingMode'], ServingMode.values),
    );
  }

  @override
  String toString() {
    return 'Cart(id: $id, userId: $userId, unitId: $unitId, place: $place, paymentMode: $paymentMode, items: $items, servingMode: $servingMode)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;
    return other is Cart &&
        other.id == id &&
        other.userId == userId &&
        other.unitId == unitId &&
        other.place == place &&
        other.paymentMode == paymentMode &&
        listEquals(other.items, items) &&
        other.servingMode == servingMode &&
        listEquals(other.items, items);
  }

  @override
  int get hashCode {
    return id.hashCode ^
        userId.hashCode ^
        unitId.hashCode ^
        place.hashCode ^
        paymentMode.hashCode ^
        items.hashCode ^
        servingMode.hashCode;
  }
}
