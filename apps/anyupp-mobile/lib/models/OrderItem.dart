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
  final String orderId;
  final String productId;
  final String productNameId;
  final LocalizedItem productName;
  final String priceShownId;
  final PriceShown priceShown;
  final int quantity;
  final List<StatusLog> statusLog;
  final String variantId;
  final LocalizedItem variantName;
  final int created;
  final String laneId;
  final bool takeAway;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const OrderItem._internal(
      {@required this.id,
      @required this.orderId,
      this.productId,
      this.productNameId,
      this.productName,
      this.priceShownId,
      this.priceShown,
      this.quantity,
      this.statusLog,
      this.variantId,
      this.variantName,
      this.created,
      this.laneId,
      this.takeAway});

  factory OrderItem(
      {String id,
      @required String orderId,
      String productId,
      String productNameId,
      LocalizedItem productName,
      String priceShownId,
      PriceShown priceShown,
      int quantity,
      List<StatusLog> statusLog,
      String variantId,
      LocalizedItem variantName,
      int created,
      String laneId,
      bool takeAway}) {
    return OrderItem._internal(
        id: id == null ? UUID.getUUID() : id,
        orderId: orderId,
        productId: productId,
        productNameId: productNameId,
        productName: productName,
        priceShownId: priceShownId,
        priceShown: priceShown,
        quantity: quantity,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        variantId: variantId,
        variantName: variantName,
        created: created,
        laneId: laneId,
        takeAway: takeAway);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OrderItem &&
        id == other.id &&
        orderId == other.orderId &&
        productId == other.productId &&
        productNameId == other.productNameId &&
        productName == other.productName &&
        priceShownId == other.priceShownId &&
        priceShown == other.priceShown &&
        quantity == other.quantity &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        variantId == other.variantId &&
        variantName == other.variantName &&
        created == other.created &&
        laneId == other.laneId &&
        takeAway == other.takeAway;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("OrderItem {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("orderId=" + "$orderId" + ", ");
    buffer.write("productId=" + "$productId" + ", ");
    buffer.write("productNameId=" + "$productNameId" + ", ");
    buffer.write("priceShownId=" + "$priceShownId" + ", ");
    buffer.write(
        "quantity=" + (quantity != null ? quantity.toString() : "null") + ", ");
    buffer.write("variantId=" + "$variantId" + ", ");
    buffer.write(
        "created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write("laneId=" + "$laneId" + ", ");
    buffer
        .write("takeAway=" + (takeAway != null ? takeAway.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  OrderItem copyWith(
      {String id,
      String orderId,
      String productId,
      String productNameId,
      LocalizedItem productName,
      String priceShownId,
      PriceShown priceShown,
      int quantity,
      List<StatusLog> statusLog,
      String variantId,
      LocalizedItem variantName,
      int created,
      String laneId,
      bool takeAway}) {
    return OrderItem(
        id: id ?? this.id,
        orderId: orderId ?? this.orderId,
        productId: productId ?? this.productId,
        productNameId: productNameId ?? this.productNameId,
        productName: productName ?? this.productName,
        priceShownId: priceShownId ?? this.priceShownId,
        priceShown: priceShown ?? this.priceShown,
        quantity: quantity ?? this.quantity,
        statusLog: statusLog ?? this.statusLog,
        variantId: variantId ?? this.variantId,
        variantName: variantName ?? this.variantName,
        created: created ?? this.created,
        laneId: laneId ?? this.laneId,
        takeAway: takeAway ?? this.takeAway);
  }

  OrderItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        orderId = json['orderId'],
        productId = json['productId'],
        productNameId = json['productNameId'],
        productName = json['productName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['productName']))
            : null,
        priceShownId = json['priceShownId'],
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
        variantId = json['variantId'],
        variantName = json['variantName'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['variantName']))
            : null,
        created = json['created'],
        laneId = json['laneId'],
        takeAway = json['takeAway'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'orderId': orderId,
        'productId': productId,
        'productNameId': productNameId,
        'productName': productName?.toJson(),
        'priceShownId': priceShownId,
        'priceShown': priceShown?.toJson(),
        'quantity': quantity,
        'statusLog': statusLog?.map((e) => e?.toJson())?.toList(),
        'variantId': variantId,
        'variantName': variantName?.toJson(),
        'created': created,
        'laneId': laneId,
        'takeAway': takeAway
      };

  static final QueryField ID = QueryField(fieldName: "orderItem.id");
  static final QueryField ORDERID = QueryField(fieldName: "orderId");
  static final QueryField PRODUCTID = QueryField(fieldName: "productId");
  static final QueryField PRODUCTNAMEID =
      QueryField(fieldName: "productNameId");
  static final QueryField PRODUCTNAME = QueryField(
      fieldName: "productName",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField PRICESHOWNID = QueryField(fieldName: "priceShownId");
  static final QueryField PRICESHOWN = QueryField(
      fieldName: "priceShown",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PriceShown).toString()));
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
  static final QueryField CREATED = QueryField(fieldName: "created");
  static final QueryField LANEID = QueryField(fieldName: "laneId");
  static final QueryField TAKEAWAY = QueryField(fieldName: "takeAway");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "OrderItem";
    modelSchemaDefinition.pluralName = "OrderItems";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.ORDERID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.PRODUCTID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.PRODUCTNAMEID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: OrderItem.PRODUCTNAME,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.PRICESHOWNID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: OrderItem.PRICESHOWN,
        isRequired: false,
        ofModelName: (PriceShown).toString(),
        associatedKey: PriceShown.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.QUANTITY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: OrderItem.STATUSLOG,
        isRequired: false,
        ofModelName: (StatusLog).toString(),
        associatedKey: StatusLog.ORDERID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.VARIANTID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasOne(
        key: OrderItem.VARIANTNAME,
        isRequired: false,
        ofModelName: (LocalizedItem).toString(),
        associatedKey: LocalizedItem.ID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.CREATED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.LANEID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: OrderItem.TAKEAWAY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));
  });
}

class OrderItemType extends ModelType<OrderItem> {
  const OrderItemType();

  @override
  OrderItem fromJson(Map<String, dynamic> jsonData) {
    return OrderItem.fromJson(jsonData);
  }
}
