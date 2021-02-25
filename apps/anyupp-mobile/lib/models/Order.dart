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

/** This is an auto generated class representing the Order type in your schema. */
@immutable
class Order extends Model {
  static const classType = const OrderType();
  final String id;
  final int created;
  final List<OrderItem> items;
  final String paymentMethod;
  final String staffId;
  final List<StatusLog> statusLog;
  final PriceShown sumPriceShown;
  final bool takeAway;
  final String userId;
  final Place place;
  final int paymentIntention;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Order._internal(
      {@required this.id,
      this.created,
      this.items,
      this.paymentMethod,
      this.staffId,
      this.statusLog,
      this.sumPriceShown,
      this.takeAway,
      this.userId,
      this.place,
      this.paymentIntention});

  factory Order(
      {String id,
      int created,
      List<OrderItem> items,
      String paymentMethod,
      String staffId,
      List<StatusLog> statusLog,
      PriceShown sumPriceShown,
      bool takeAway,
      String userId,
      Place place,
      int paymentIntention}) {
    return Order._internal(
        id: id == null ? UUID.getUUID() : id,
        created: created,
        items: items != null ? List.unmodifiable(items) : items,
        paymentMethod: paymentMethod,
        staffId: staffId,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        sumPriceShown: sumPriceShown,
        takeAway: takeAway,
        userId: userId,
        place: place,
        paymentIntention: paymentIntention);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Order &&
        id == other.id &&
        created == other.created &&
        DeepCollectionEquality().equals(items, other.items) &&
        paymentMethod == other.paymentMethod &&
        staffId == other.staffId &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        sumPriceShown == other.sumPriceShown &&
        takeAway == other.takeAway &&
        userId == other.userId &&
        place == other.place &&
        paymentIntention == other.paymentIntention;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Order {");
    buffer.write("id=" + id + ", ");
    buffer.write(
        "created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write("paymentMethod=" + paymentMethod + ", ");
    buffer.write("staffId=" + staffId + ", ");
    buffer.write("sumPriceShown=" +
        (sumPriceShown != null ? sumPriceShown.toString() : "null") +
        ", ");
    buffer.write(
        "takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("userId=" + userId + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null") + ", ");
    buffer.write("paymentIntention=" +
        (paymentIntention != null ? paymentIntention.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Order copyWith(
      {String id,
      int created,
      List<OrderItem> items,
      String paymentMethod,
      String staffId,
      List<StatusLog> statusLog,
      PriceShown sumPriceShown,
      bool takeAway,
      String userId,
      Place place,
      int paymentIntention}) {
    return Order(
        id: id ?? this.id,
        created: created ?? this.created,
        items: items ?? this.items,
        paymentMethod: paymentMethod ?? this.paymentMethod,
        staffId: staffId ?? this.staffId,
        statusLog: statusLog ?? this.statusLog,
        sumPriceShown: sumPriceShown ?? this.sumPriceShown,
        takeAway: takeAway ?? this.takeAway,
        userId: userId ?? this.userId,
        place: place ?? this.place,
        paymentIntention: paymentIntention ?? this.paymentIntention);
  }

  Order.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        created = json['created'],
        items = json['items'] is List
            ? (json['items'] as List)
                .map(
                    (e) => OrderItem.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        paymentMethod = json['paymentMethod'],
        staffId = json['staffId'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List)
                .map(
                    (e) => StatusLog.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        sumPriceShown = json['sumPriceShown'] != null
            ? PriceShown.fromJson(
                new Map<String, dynamic>.from(json['sumPriceShown']))
            : null,
        takeAway = json['takeAway'],
        userId = json['userId'],
        place = json['place'] != null
            ? Place.fromJson(new Map<String, dynamic>.from(json['place']))
            : null,
        paymentIntention = json['paymentIntention'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'created': created,
        'items': items?.map((e) => e?.toJson()).toList(),
        'paymentMethod': paymentMethod,
        'staffId': staffId,
        'statusLog': statusLog?.map((e) => e?.toJson()).toList(),
        'sumPriceShown': sumPriceShown?.toJson(),
        'takeAway': takeAway,
        'userId': userId,
        'place': place?.toJson(),
        'paymentIntention': paymentIntention
      };

  static final QueryField ID = QueryField(fieldName: "order.id");
  static final QueryField CREATED = QueryField(fieldName: "created");
  static final QueryField ITEMS = QueryField(
      fieldName: "items",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (OrderItem).toString()));
  static final QueryField PAYMENTMETHOD =
      QueryField(fieldName: "paymentMethod");
  static final QueryField STAFFID = QueryField(fieldName: "staffId");
  static final QueryField STATUSLOG = QueryField(
      fieldName: "statusLog",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (StatusLog).toString()));
  static final QueryField SUMPRICESHOWN = QueryField(
      fieldName: "sumPriceShown",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PriceShown).toString()));
  static final QueryField TAKEAWAY = QueryField(fieldName: "takeAway");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField PLACE = QueryField(
      fieldName: "place",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Place).toString()));
  static final QueryField PAYMENTINTENTION =
      QueryField(fieldName: "paymentIntention");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Order";
    modelSchemaDefinition.pluralName = "Orders";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.CREATED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Order.ITEMS,
        isRequired: false,
        ofModelName: (OrderItem).toString(),
        associatedKey: OrderItem.ORDERITEMSID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.PAYMENTMETHOD,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.STAFFID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Order.STATUSLOG,
        isRequired: false,
        ofModelName: (StatusLog).toString(),
        associatedKey: StatusLog.ORDERSTATUSLOGID));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Order.SUMPRICESHOWN,
        isRequired: false,
        targetName: "orderSumPriceShownId",
        ofModelName: (PriceShown).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.TAKEAWAY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.USERID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Order.PLACE,
        isRequired: false,
        targetName: "orderPlaceId",
        ofModelName: (Place).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.PAYMENTINTENTION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));
  });
}

class OrderType extends ModelType<Order> {
  const OrderType();

  @override
  Order fromJson(Map<String, dynamic> jsonData) {
    return Order.fromJson(jsonData);
  }
}
