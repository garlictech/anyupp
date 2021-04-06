import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';

@immutable
class Cart extends Model {
  final String id;
  final String userId;
  final String unitId;
  final bool takeAway;
  final Place place;
  final PaymentMode paymentMethod;
  final int created;
  final List<CartItem> items;

  @override
  String getId() {
    return id;
  }

  const Cart._internal(
      {@required this.id,
      @required this.userId,
      @required this.unitId,
      this.takeAway,
      this.place,
      @required this.paymentMethod,
      this.created,
      this.items});

  factory Cart(
      {String id,
      @required String userId,
      @required String unitId,
      bool takeAway,
      Place place,
      @required PaymentMode paymentMethod,
      int created,
      List<CartItem> items}) {
    return Cart._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        unitId: unitId,
        takeAway: takeAway,
        place: place,
        paymentMethod: paymentMethod,
        created: created,
        items: items != null ? List.unmodifiable(items) : items);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Cart &&
        id == other.id &&
        userId == other.userId &&
        unitId == other.unitId &&
        takeAway == other.takeAway &&
        place == other.place &&
        paymentMethod == other.paymentMethod &&
        created == other.created &&
        DeepCollectionEquality().equals(items, other.items);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("Cart {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write(
        "takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null") + ", ");
    buffer.write("paymentMethod=" +
        (paymentMethod != null ? paymentMethod.toString() : "null") +
        ", ");
    buffer.write("created=" + (created != null ? created.toString() : "null"));
    buffer.write("items=$items");
    buffer.write("}");

    return buffer.toString();
  }

  Cart copyWith(
      {String id,
      String userId,
      String unitId,
      bool takeAway,
      Place place,
      PaymentMode paymentMethod,
      int created,
      List<CartItem> items}) {
    return Cart(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        takeAway: takeAway ?? this.takeAway,
        place: place ?? this.place,
        paymentMethod: paymentMethod ?? this.paymentMethod,
        created: created ?? this.created,
        items: items ?? this.items);
  }

  Cart.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        unitId = json['unitId'],
        takeAway = json['takeAway'],
        place = json['place'] != null
            ? Place.fromJson(Map<String, dynamic>.from(json['place']))
            : null,
        paymentMethod = json['paymentMethod'] != null
            ? PaymentMode.fromJson(
                Map<String, dynamic>.from(json['paymentMethod']))
            : null,
        created = json['created'],
        items = json['items'] is List
            ? (json['items'] as List)
                .map((e) => CartItem.fromJson(Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'unitId': unitId,
        'takeAway': takeAway,
        'place': place?.toJson(),
        'paymentMethod': paymentMethod?.toJson(),
        'created': created,
        'items': items?.map((e) => e?.toJson())?.toList()
      };
}
