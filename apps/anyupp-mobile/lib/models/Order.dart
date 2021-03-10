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
  final String userId;
  final String unitId;
  final List<OrderItem> items;
  final PaymentMode paymentMethod;
  final String staffId;
  final PriceShown sumPriceShown;
  final bool takeAway;
  final Place place;
  final int paymentIntention;
  final List<StatusLog> statusLog;
  final int created;
  final OrderSatus status;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Order._internal(
      {@required this.id,
      @required this.userId,
      @required this.unitId,
      this.items,
      this.paymentMethod,
      this.staffId,
      this.sumPriceShown,
      this.takeAway,
      this.place,
      this.paymentIntention,
      this.statusLog,
      this.created,
      this.status});

  factory Order(
      {String id,
      @required String userId,
      @required String unitId,
      List<OrderItem> items,
      PaymentMode paymentMethod,
      String staffId,
      PriceShown sumPriceShown,
      bool takeAway,
      Place place,
      int paymentIntention,
      List<StatusLog> statusLog,
      int created,
      OrderSatus status}) {
    return Order._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        unitId: unitId,
        items: items != null ? List.unmodifiable(items) : items,
        paymentMethod: paymentMethod,
        staffId: staffId,
        sumPriceShown: sumPriceShown,
        takeAway: takeAway,
        place: place,
        paymentIntention: paymentIntention,
        statusLog: statusLog != null ? List.unmodifiable(statusLog) : statusLog,
        created: created,
        status: status);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Order &&
        id == other.id &&
        userId == other.userId &&
        unitId == other.unitId &&
        DeepCollectionEquality().equals(items, other.items) &&
        paymentMethod == other.paymentMethod &&
        staffId == other.staffId &&
        sumPriceShown == other.sumPriceShown &&
        takeAway == other.takeAway &&
        place == other.place &&
        paymentIntention == other.paymentIntention &&
        DeepCollectionEquality().equals(statusLog, other.statusLog) &&
        created == other.created &&
        status == other.status;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Order {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("paymentMethod=" +
        (paymentMethod != null ? paymentMethod.toString() : "null") +
        ", ");
    buffer.write("staffId=" + "$staffId" + ", ");
    buffer.write("sumPriceShown=" +
        (sumPriceShown != null ? sumPriceShown.toString() : "null") +
        ", ");
    buffer.write(
        "takeAway=" + (takeAway != null ? takeAway.toString() : "null") + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null") + ", ");
    buffer.write("paymentIntention=" +
        (paymentIntention != null ? paymentIntention.toString() : "null") +
        ", ");
    buffer.write(
        "created=" + (created != null ? created.toString() : "null") + ", ");
    buffer.write("status=" + (status != null ? enumToString(status) : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Order copyWith(
      {String id,
      String userId,
      String unitId,
      List<OrderItem> items,
      PaymentMode paymentMethod,
      String staffId,
      PriceShown sumPriceShown,
      bool takeAway,
      Place place,
      int paymentIntention,
      List<StatusLog> statusLog,
      int created,
      OrderSatus status}) {
    return Order(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        items: items ?? this.items,
        paymentMethod: paymentMethod ?? this.paymentMethod,
        staffId: staffId ?? this.staffId,
        sumPriceShown: sumPriceShown ?? this.sumPriceShown,
        takeAway: takeAway ?? this.takeAway,
        place: place ?? this.place,
        paymentIntention: paymentIntention ?? this.paymentIntention,
        statusLog: statusLog ?? this.statusLog,
        created: created ?? this.created,
        status: status ?? this.status);
  }

  Order.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        unitId = json['unitId'],
        items = json['items'] is List
            ? (json['items'] as List)
                .map(
                    (e) => OrderItem.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        paymentMethod = json['paymentMethod'] != null
            ? PaymentMode.fromJson(
                new Map<String, dynamic>.from(json['paymentMethod']))
            : null,
        staffId = json['staffId'],
        sumPriceShown = json['sumPriceShown'] != null
            ? PriceShown.fromJson(
                new Map<String, dynamic>.from(json['sumPriceShown']))
            : null,
        takeAway = json['takeAway'],
        place = json['place'] != null
            ? Place.fromJson(new Map<String, dynamic>.from(json['place']))
            : null,
        paymentIntention = json['paymentIntention'],
        statusLog = json['statusLog'] is List
            ? (json['statusLog'] as List)
                .map(
                    (e) => StatusLog.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null,
        created = json['created'],
        status = enumFromString<OrderSatus>(json['status'], OrderSatus.values);

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'unitId': unitId,
        'items': items?.map((e) => e?.toJson())?.toList(),
        'paymentMethod': paymentMethod?.toJson(),
        'staffId': staffId,
        'sumPriceShown': sumPriceShown?.toJson(),
        'takeAway': takeAway,
        'place': place?.toJson(),
        'paymentIntention': paymentIntention,
        'statusLog': statusLog?.map((e) => e?.toJson())?.toList(),
        'created': created,
        'status': enumToString(status)
      };

  static final QueryField ID = QueryField(fieldName: "order.id");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField ITEMS = QueryField(
      fieldName: "items",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (OrderItem).toString()));
  static final QueryField PAYMENTMETHOD = QueryField(
      fieldName: "paymentMethod",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static final QueryField STAFFID = QueryField(fieldName: "staffId");
  static final QueryField SUMPRICESHOWN = QueryField(
      fieldName: "sumPriceShown",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PriceShown).toString()));
  static final QueryField TAKEAWAY = QueryField(fieldName: "takeAway");
  static final QueryField PLACE = QueryField(
      fieldName: "place",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Place).toString()));
  static final QueryField PAYMENTINTENTION =
      QueryField(fieldName: "paymentIntention");
  static final QueryField STATUSLOG = QueryField(
      fieldName: "statusLog",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (StatusLog).toString()));
  static final QueryField CREATED = QueryField(fieldName: "created");
  static final QueryField STATUS = QueryField(fieldName: "status");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Order";
    modelSchemaDefinition.pluralName = "Orders";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.USERID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Order.ITEMS,
        isRequired: false,
        ofModelName: (OrderItem).toString(),
        associatedKey: OrderItem.ORDERITEMSID));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Order.PAYMENTMETHOD,
        isRequired: false,
        targetName: "orderPaymentMethodId",
        ofModelName: (PaymentMode).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.STAFFID,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Order.SUMPRICESHOWN,
        isRequired: false,
        targetName: "orderSumPriceShownId",
        ofModelName: (PriceShown).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.TAKEAWAY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Order.PLACE,
        isRequired: false,
        targetName: "orderPlaceId",
        ofModelName: (Place).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.PAYMENTINTENTION,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Order.STATUSLOG,
        isRequired: false,
        ofModelName: (StatusLog).toString(),
        associatedKey: StatusLog.ORDERSTATUSLOGID));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.CREATED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Order.STATUS,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.enumeration)));
  });
}

class OrderType extends ModelType<Order> {
  const OrderType();

  @override
  Order fromJson(Map<String, dynamic> jsonData) {
    return Order.fromJson(jsonData);
  }
}
