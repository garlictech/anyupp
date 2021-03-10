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

/** This is an auto generated class representing the FavoriteProduct type in your schema. */
@immutable
class FavoriteProduct extends Model {
  static const classType = const FavoriteProductType();
  final String id;
  final String userId;
  final String unitId;
  final GeneratedProduct product;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const FavoriteProduct._internal(
      {@required this.id,
      @required this.userId,
      @required this.unitId,
      this.product});

  factory FavoriteProduct(
      {String id,
      @required String userId,
      @required String unitId,
      GeneratedProduct product}) {
    return FavoriteProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        userId: userId,
        unitId: unitId,
        product: product);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FavoriteProduct &&
        id == other.id &&
        userId == other.userId &&
        unitId == other.unitId &&
        product == other.product;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("FavoriteProduct {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("userId=" + "$userId" + ", ");
    buffer.write("unitId=" + "$unitId" + ", ");
    buffer.write("product=" + (product != null ? product.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  FavoriteProduct copyWith(
      {String id, String userId, String unitId, GeneratedProduct product}) {
    return FavoriteProduct(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        unitId: unitId ?? this.unitId,
        product: product ?? this.product);
  }

  FavoriteProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userId = json['userId'],
        unitId = json['unitId'],
        product = json['product'] != null
            ? GeneratedProduct.fromJson(
                new Map<String, dynamic>.from(json['product']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'unitId': unitId,
        'product': product?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "favoriteProduct.id");
  static final QueryField USERID = QueryField(fieldName: "userId");
  static final QueryField UNITID = QueryField(fieldName: "unitId");
  static final QueryField PRODUCT = QueryField(
      fieldName: "product",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (GeneratedProduct).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "FavoriteProduct";
    modelSchemaDefinition.pluralName = "FavoriteProducts";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FavoriteProduct.USERID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: FavoriteProduct.UNITID,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: FavoriteProduct.PRODUCT,
        isRequired: false,
        targetName: "favoriteProductProductId",
        ofModelName: (GeneratedProduct).toString()));
  });
}

class FavoriteProductType extends ModelType<FavoriteProduct> {
  const FavoriteProductType();

  @override
  FavoriteProduct fromJson(Map<String, dynamic> jsonData) {
    return FavoriteProduct.fromJson(jsonData);
  }
}
