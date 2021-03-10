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
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the Cart type in your schema. */
@immutable
class Cart extends Model {
  static const classType = const CartType();
  final String id;
  final String userId;
  final String unitId;
  final Order order;

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
      this.order});

  factory Cart(
      {String id,
      @required String userId,
      @required String unitId,
      Order order}) {
    return Cart._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        unitId: unitId,
        order: order);
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
        order == other.order;
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
    buffer.write("order=" + (order != null ? order.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Cart copyWith({String id, String userId, String unitId, Order order}) {
    return Cart(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        order: order ?? this.order);
  }

  Cart.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        unitId = json['unitId'],
        order = json['order'] != null
            ? Order.fromJson(new Map<String, dynamic>.from(json['order']))
            : null;

  Map<String, dynamic> toJson() =>
      {'id': id, 'userId': userId, 'unitId': unitId, 'order': order?.toJson()};

  static final QueryField ID = QueryField(fieldName: "cart.id");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField ORDER = QueryField(
      fieldName: "order",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (Order).toString()));
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

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Cart.ORDER,
        isRequired: false,
        targetName: "cartOrderId",
        ofModelName: (Order).toString()));
  });
}

class CartType extends ModelType<Cart> {
  const CartType();

  @override
  Cart fromJson(Map<String, dynamic> jsonData) {
    return Cart.fromJson(jsonData);
  }
}
