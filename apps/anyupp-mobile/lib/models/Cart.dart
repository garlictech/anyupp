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

/** This is an auto generated class representing the Cart type in your schema. */
@immutable
class Cart extends Model {
  static const classType = const CartType();
  final String id;
  final String userId;
  final String unitId;
  final bool takeAway;
  final Place place;
  final PaymentMode paymentMethod;
  final int created;
  final List<CartItem> items;

  @override
  getInstanceType() => classType;

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
    var buffer = new StringBuffer();

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
            ? Place.fromJson(new Map<String, dynamic>.from(json['place']))
            : null,
        paymentMethod = json['paymentMethod'] != null
            ? PaymentMode.fromJson(
                new Map<String, dynamic>.from(json['paymentMethod']))
            : null,
        created = json['created'],
        items = json['items'] is List
            ? (json['items'] as List)
                .map((e) => CartItem.fromJson(new Map<String, dynamic>.from(e)))
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

  static final QueryField ID = QueryField(fieldName: "cart.id");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField TAKEAWAY = QueryField(fieldName: "takeAway");
  static final QueryField PLACE = QueryField(
      fieldName: "place",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Place).toString()));
  static final QueryField PAYMENTMETHOD = QueryField(
      fieldName: "paymentMethod",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (PaymentMode).toString()));
  static final QueryField CREATED = QueryField(fieldName: "created");
  static final QueryField ITEMS = QueryField(
      fieldName: "items",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (CartItem).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Cart";
    modelSchemaDefinition.pluralName = "Carts";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Cart.USERID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Cart.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Cart.TAKEAWAY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Cart.PLACE,
        isRequired: false,
        targetName: "cartPlaceId",
        ofModelName: (Place).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Cart.PAYMENTMETHOD,
        isRequired: true,
        targetName: "cartPaymentMethodId",
        ofModelName: (PaymentMode).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Cart.CREATED,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: Cart.ITEMS,
        isRequired: false,
        ofModelName: (CartItem).toString(),
        associatedKey: CartItem.CARTITEMSID));
  });
}

class CartType extends ModelType<Cart> {
  const CartType();

  @override
  Cart fromJson(Map<String, dynamic> jsonData) {
    return Cart.fromJson(jsonData);
  }
}
