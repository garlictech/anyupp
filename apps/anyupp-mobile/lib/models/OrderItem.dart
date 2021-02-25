/*
* Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

// ignore_for_file: public_member_api_docs

import 'ModelProvider.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'package:collection/collection.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the OrderItem type in your schema. */
@immutable
class OrderItem extends Model {
  static const classType = const OrderItemType();
  final String id;
  final int created;
  final LocalizedItem productName;
  final PriceShown priceShown;
  final String productId;
  final int quantity;
  final List<StatusLog> statusLog;
  final String variantId;
  final LocalizedItem variantName;
  final String laneId;
  final String orderItemsId;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const OrderItem._internal(
      {@required this.id,
      this.created,
      this.productName,
      this.priceShown,
      this.productId,
      this.quantity,
      this.statusLog,
      this.variantId,
      this.variantName,
      this.laneId,
      this.orderItemsId});

  factory OrderItem(
      {String id,
      int created,
      LocalizedItem productName,
      PriceShown priceShown,
      String productId,
      int quantity,
      List<StatusLog> statusLog,
      String variantId,
      LocalizedItem variantName,
      String laneId,
      String orderItemsId}) {
    return OrderItem._internal(
        id: id == null ? UUID.getUUID() : id,
        created: created,
        productName: productName,
        priceShown: priceShown,
        productId: productId,
        quantity: quantity,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        variantId: variantId,
        variantName: variantName,
        laneId: laneId,
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
        created == other.created &&
        productName == other.productName &&
        priceShown == other.priceShown &&
        productId == other.productId &&
        quantity == other.quantity &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        variantId == other.variantId &&
        variantName == other.variantName &&
        laneId == other.laneId &&
        orderItemsId == other.orderItemsId;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("OrderItem {");
    buffer.write("id=" + id + ", ");
    buffer.write(
        "created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write("productName=" +
        (productName != null ? productName.toString() : "null") +
        ", ");
    buffer.write("priceShown=" +
        (priceShown != null ? priceShown.toString() : "null") +
        ", ");
    buffer.write("productId=" + productId + ", ");
    buffer.write(
        "quantity=" + (quantity != null ? quantity.toString() : "null") + ", ");
    buffer.write("variantId=" + variantId + ", ");
    buffer.write("variantName=" +
        (variantName != null ? variantName.toString() : "null") +
        ", ");
    buffer.write("laneId=" + laneId + ", ");
    buffer.write("orderItemsId=" + orderItemsId);
    buffer.write("}");

    return buffer.toString();
  }

  OrderItem copyWith(
      {String id,
      int created,
      LocalizedItem productName,
      PriceShown priceShown,
      String productId,
      int quantity,
      List<StatusLog> statusLog,
      String variantId,
      LocalizedItem variantName,
      String laneId,
      String orderItemsId}) {
    return OrderItem(
        id: id ?? this.id,
        created: created ?? this.created,
        productName: productName ?? this.productName,
        priceShown: priceShown ?? this.priceShown,
        productId: productId ?? this.productId,
        quantity: quantity ?? this.quantity,
        statusLog: statusLog ?? this.statusLog,
        variantId: variantId ?? this.variantId,
        variantName: variantName ?? this.variantName,
        laneId: laneId ?? this.laneId,
        orderItemsId: orderItemsId ?? this.orderItemsId);
  }

  OrderItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        created = json['created'],
        productName = json['productName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['productName']))
            : null,
        priceShown = json['priceShown'] != null
            ? PriceShown.fromJson(
                new Map<String, dynamic>.from(json['priceShown']))
            : null,
        productId = json['productId'],
        quantity = json['quantity'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List)
                .map(
                    (e) => StatusLog.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        variantId = json['variantId'],
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['variantName']))
            : null,
        laneId = json['laneId'],
        orderItemsId = json['orderItemsId'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'created': created,
        'productName': productName?.toJson(),
        'priceShown': priceShown?.toJson(),
        'productId': productId,
        'quantity': quantity,
        'statusLog': statusLog?.map((e) => e?.toJson()).toList(),
        'variantId': variantId,
        'variantName': variantName?.toJson(),
        'laneId': laneId,
        'orderItemsId': orderItemsId
      };

  static final QueryField ID = QueryField(fieldName: "orderItem.id");
  static final QueryField CREATED = QueryField(fieldName: "created");
  static final QueryField PRODUCTNAME = QueryField(
      fieldName: "productName",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PRICESHOWN = QueryField(
      fieldName: "priceShown",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PriceShown).toString()));
  static final QueryField PRODUCTID = QueryField(fieldName: "productId");
  static final QueryField QUANTITY = QueryField(fieldName: "quantity");
  static final QueryField STATUSLOG = QueryField(
      fieldName: "statusLog",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (StatusLog).toString()));
  static final QueryField VARIANTID = QueryField(fieldName: "variantId");
  static final QueryField VARIANTNAME = QueryField(
      fieldName: "variantName",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField LANEID = QueryField(fieldName: "laneId");
  static final QueryField ORDERITEMSID = QueryField(fieldName: "orderItemsId");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "OrderItem";
    modelSchemaDefinition.pluralName = "OrderItems";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.CREATED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: OrderItem.PRODUCTNAME,
        isRequired: false,
        targetName: "orderItemProductNameId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: OrderItem.PRICESHOWN,
        isRequired: false,
        targetName: "orderItemPriceShownId",
        ofModelName: (PriceShown).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.PRODUCTID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.QUANTITY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: OrderItem.STATUSLOG,
        isRequired: false,
        ofModelName: (StatusLog).toString(),
        associatedKey: StatusLog.ORDERITEMSTATUSLOGID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.VARIANTID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: OrderItem.VARIANTNAME,
        isRequired: false,
        targetName: "orderItemVariantNameId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.LANEID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.ORDERITEMSID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class OrderItemType extends ModelType<OrderItem> {
  const OrderItemType();

  @override
  OrderItem fromJson(Map<String, dynamic> jsonData) {
    return OrderItem.fromJson(jsonData);
  }
}
