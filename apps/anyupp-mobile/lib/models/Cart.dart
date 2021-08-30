import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';

class Cart {
  final String? id;
  final String userId;
  final String unitId;
  final bool takeAway;
  final Place? place;
  final PaymentMode? paymentMode;
  final List<OrderItem> items;
  Cart({
    this.id,
    required this.userId,
    required this.unitId,
    required this.takeAway,
    this.place,
    this.paymentMode,
    required this.items,
  });

  Cart copyWith({
    String? id,
    String? userId,
    String? unitId,
    bool? takeAway,
    Place? place,
    PaymentMode? paymentMode,
    List<OrderItem>? items,
  }) {
    return Cart(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      unitId: unitId ?? this.unitId,
      takeAway: takeAway ?? this.takeAway,
      place: place ?? this.place,
      paymentMode: paymentMode ?? this.paymentMode,
      items: items ?? this.items,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'unitId': unitId,
      'takeAway': takeAway,
      'place': place?.toJson(),
      'paymentMode': paymentMode?.toJson(),
      'items': items.map((x) => x.toJson()).toList(),
    };
  }

  factory Cart.fromJson(Map<String, dynamic> map) {
    return Cart(
      id: map['id'],
      userId: map['userId'],
      unitId: map['unitId'],
      takeAway: map['takeAway'],
      place: map['place'] != null ? Place.fromJson(map['place']) : null,
      paymentMode: map['paymentMode'] != null ? PaymentMode.fromJson(map['paymentMode']) : null,
      items: List<OrderItem>.from(map['items']?.map((x) => OrderItem.fromJson(x))),
    );
  }

  @override
  String toString() {
    return 'Cart(id: $id, userId: $userId, unitId: $unitId, takeAway: $takeAway, place: $place, paymentMode: $paymentMode, items: $items)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    final listEquals = const DeepCollectionEquality().equals;

    return other is Cart &&
        other.id == id &&
        other.userId == userId &&
        other.unitId == unitId &&
        other.takeAway == takeAway &&
        other.place == place &&
        other.paymentMode == paymentMode &&
        listEquals(other.items, items);
  }

  @override
  int get hashCode {
    return id.hashCode ^
        userId.hashCode ^
        unitId.hashCode ^
        takeAway.hashCode ^
        place.hashCode ^
        paymentMode.hashCode ^
        items.hashCode;
  }
}
