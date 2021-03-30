import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class OrderItem extends Model {
  final String id;
  final String productId;
  final String variantId;
  final LocalizedItem productName;
  final PriceShown priceShown;
  final int quantity;
  final List<StatusLog> statusLog;
  final LocalizedItem variantName;
  final int created;
  final bool takeAway;
  final String orderItemsId;

  @override
  String getId() {
    return id;
  }

  const OrderItem._internal(
      {@required this.id,
      @required this.productId,
      @required this.variantId,
      this.productName,
      this.priceShown,
      @required this.quantity,
      this.statusLog,
      this.variantName,
      this.created,
      this.takeAway,
      this.orderItemsId});

  factory OrderItem(
      {String id,
      @required String productId,
      @required String variantId,
      LocalizedItem productName,
      PriceShown priceShown,
      @required int quantity,
      List<StatusLog> statusLog,
      LocalizedItem variantName,
      int created,
      bool takeAway,
      String orderItemsId}) {
    return OrderItem._internal(
        id: id == null ? UUID.getUUID() : id,
        productId: productId,
        variantId: variantId,
        productName: productName,
        priceShown: priceShown,
        quantity: quantity,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        variantName: variantName,
        created: created,
        takeAway: takeAway,
        orderItemsId: orderItemsId);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OrderItem &&
        id == other.id &&
        productId == other.productId &&
        variantId == other.variantId &&
        productName == other.productName &&
        priceShown == other.priceShown &&
        quantity == other.quantity &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        variantName == other.variantName &&
        created == other.created &&
        takeAway == other.takeAway &&
        orderItemsId == other.orderItemsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("OrderItem {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("productId=" + "$productId" + ", ");
    buffer.write("variantId=" + "$variantId" + ", ");
    buffer.write("productName=" +
        (productName != null ? productName.toString() : "null") +
        ", ");
    buffer.write("priceShown=" +
        (priceShown != null ? priceShown.toString() : "null") +
        ", ");
    buffer.write(
        "quantity=" + (quantity != null ? quantity.toString() : "null") + ", ");
    buffer.write("variantName=" +
        (variantName != null ? variantName.toString() : "null") +
        ", ");
    buffer.write(
        "created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write(
        "takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("orderItemsId=" + "$orderItemsId");
    buffer.write("}");

    return buffer.toString();
  }

  OrderItem copyWith(
      {String id,
      String productId,
      String variantId,
      LocalizedItem productName,
      PriceShown priceShown,
      int quantity,
      List<StatusLog> statusLog,
      LocalizedItem variantName,
      int created,
      bool takeAway,
      String orderItemsId}) {
    return OrderItem(
        id: id ?? this.id,
        productId: productId ?? this.productId,
        variantId: variantId ?? this.variantId,
        productName: productName ?? this.productName,
        priceShown: priceShown ?? this.priceShown,
        quantity: quantity ?? this.quantity,
        statusLog: statusLog ?? this.statusLog,
        variantName: variantName ?? this.variantName,
        created: created ?? this.created,
        takeAway: takeAway ?? this.takeAway,
        orderItemsId: orderItemsId ?? this.orderItemsId);
  }

  OrderItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        productId = json['productId'],
        variantId = json['variantId'],
        productName = json['productName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['productName']))
            : null,
        priceShown = json['priceShown'] != null
            ? PriceShown.fromJson(
                new Map<String, dynamic>.from(json['priceShown']))
            : null,
        quantity = json['quantity'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List)
                .map(
                    (e) => StatusLog.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['variantName']))
            : null,
        created = json['created'],
        takeAway = json['takeAway'],
        orderItemsId = json['orderItemsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'variantId': variantId,
        'productName': productName?.toJson(),
        'priceShown': priceShown?.toJson(),
        'quantity': quantity,
        'statusLog': statusLog?.map((e) => e?.toJson())?.toList(),
        'variantName': variantName?.toJson(),
        'created': created,
        'takeAway': takeAway,
        'orderItemsId': orderItemsId
      };
}
