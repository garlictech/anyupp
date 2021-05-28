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
  final bool takeAway;
  final String orderItemsId;
  final String image;
  final List<String> allergens;
  final Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> selectedConfigMap;

  @override
  String getId() {
    return id;
  }

  OrderItem._internal(
      {@required this.id,
      @required this.productId,
      @required this.variantId,
      this.productName,
      this.priceShown,
      @required this.quantity,
      this.statusLog,
      this.variantName,
      this.takeAway,
      this.orderItemsId,
      this.image,
      this.allergens,
      this.selectedConfigMap});

  factory OrderItem(
      {String id,
      @required String productId,
      @required String variantId,
      LocalizedItem productName,
      PriceShown priceShown,
      @required int quantity,
      List<StatusLog> statusLog,
      LocalizedItem variantName,
      bool takeAway,
      String orderItemsId,
      String image,
      List<String> allergens,
      Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> selectedConfigMap}) {
    return OrderItem._internal(
        id: id == null ? UUID.getUUID() : id,
        productId: productId,
        variantId: variantId,
        productName: productName,
        priceShown: priceShown,
        quantity: quantity,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        variantName: variantName,
        takeAway: takeAway,
        orderItemsId: orderItemsId,
        image: image,
        allergens: allergens,
        selectedConfigMap: selectedConfigMap
       );
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
        takeAway == other.takeAway &&
        orderItemsId == other.orderItemsId &&
        image == image &&
        ListEquality().equals(allergens, other.allergens) &&
        mapEquals(selectedConfigMap, other.selectedConfigMap);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("OrderItem {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("productId=" + "$productId" + ", ");
    buffer.write("variantId=" + "$variantId" + ", ");
    buffer.write("productName=" + (productName != null ? productName.toString() : "null") + ", ");
    buffer.write("priceShown=" + (priceShown != null ? priceShown.toString() : "null") + ", ");
    buffer.write("quantity=" + (quantity != null ? quantity.toString() : "null") + ", ");
    buffer.write("variantName=" + (variantName != null ? variantName.toString() : "null") + ", ");
    buffer.write("takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("orderItemsId=" + "$orderItemsId" + ", ");
    buffer.write("image=" + "$image");
    buffer.write(allergens.toString());
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
      bool takeAway,
      String orderItemsId,
      String image,
      List<String> allergens,
      Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> selectedConfigMap}) {
    return OrderItem(
        id: id ?? this.id,
        productId: productId ?? this.productId,
        variantId: variantId ?? this.variantId,
        productName: productName ?? this.productName,
        priceShown: priceShown ?? this.priceShown,
        quantity: quantity ?? this.quantity,
        statusLog: statusLog ?? this.statusLog,
        variantName: variantName ?? this.variantName,
        takeAway: takeAway ?? this.takeAway,
        orderItemsId: orderItemsId ?? this.orderItemsId,
        image: image ?? this.image,
        allergens: allergens ?? this.allergens,
        selectedConfigMap: selectedConfigMap ?? this.selectedConfigMap);
  }

  OrderItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        productId = json['productId'],
        variantId = json['variantId'],
        productName =
            json['productName'] != null ? LocalizedItem.fromJson(Map<String, dynamic>.from(json['productName'])) : null,
        priceShown =
            json['priceShown'] != null ? PriceShown.fromJson(Map<String, dynamic>.from(json['priceShown'])) : null,
        quantity = json['quantity'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List).map((e) => StatusLog.fromJson(Map<String, dynamic>.from(e))).toList()
            : null,
        variantName =
            json['variantName'] != null ? LocalizedItem.fromJson(Map<String, dynamic>.from(json['variantName'])) : null,
        takeAway = json['takeAway'],
        orderItemsId = json['orderItemsId'],
        image = json['image'],
        //TODO replace with real item
        allergens = json['allergens'] is List ? (json['allergens'] as List).map((e) => e as String).toList() : null,
        selectedConfigMap = null;
        

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'variantId': variantId,
        'productName': productName?.toJson(),
        'priceShown': priceShown?.toJson(),
        'quantity': quantity,
        'statusLog': statusLog?.map((e) => e?.toJson())?.toList(),
        'variantName': variantName?.toJson(),
        'takeAway': takeAway,
        'orderItemsId': orderItemsId,
        'image': image,
        'allergens': allergens
      };
}
