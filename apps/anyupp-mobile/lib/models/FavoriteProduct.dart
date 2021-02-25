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
  final String userID;
  final String chainID;
  final String unitID;
  final ChainProduct product;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const FavoriteProduct._internal(
      {@required this.id,
      @required this.userID,
      @required this.chainID,
      @required this.unitID,
      this.product});

  factory FavoriteProduct(
      {String id,
      @required String userID,
      @required String chainID,
      @required String unitID,
      ChainProduct product}) {
    return FavoriteProduct._internal(
        id: id == null ? UUID.getUUID() : id,
        userID: userID,
        chainID: chainID,
        unitID: unitID,
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
        userID == other.userID &&
        chainID == other.chainID &&
        unitID == other.unitID &&
        product == other.product;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("FavoriteProduct {");
    buffer.write("id=" + id + ", ");
    buffer.write("userID=" + userID + ", ");
    buffer.write("chainID=" + chainID + ", ");
    buffer.write("unitID=" + unitID + ", ");
    buffer.write("product=" + (product != null ? product.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  FavoriteProduct copyWith(
      {String id,
      String userID,
      String chainID,
      String unitID,
      ChainProduct product}) {
    return FavoriteProduct(
        id: id ?? this.id,
        userID: userID ?? this.userID,
        chainID: chainID ?? this.chainID,
        unitID: unitID ?? this.unitID,
        product: product ?? this.product);
  }

  FavoriteProduct.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        userID = json['userID'],
        chainID = json['chainID'],
        unitID = json['unitID'],
        product = json['product'] != null
            ? ChainProduct.fromJson(
                new Map<String, dynamic>.from(json['product']))
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'userID': userID,
        'chainID': chainID,
        'unitID': unitID,
        'product': product?.toJson()
      };

  static final QueryField ID = QueryField(fieldName: "favoriteProduct.id");
  static final QueryField USERID = QueryField(fieldName: "userID");
  static final QueryField CHAINID = QueryField(fieldName: "chainID");
  static final QueryField UNITID = QueryField(fieldName: "unitID");
  static final QueryField PRODUCT = QueryField(
      fieldName: "product",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainProduct).toString()));
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
        key: FavoriteProduct.CHAINID,
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
        ofModelName: (ChainProduct).toString()));
  });
}

class FavoriteProductType extends ModelType<FavoriteProduct> {
  const FavoriteProductType();

  @override
  FavoriteProduct fromJson(Map<String, dynamic> jsonData) {
    return FavoriteProduct.fromJson(jsonData);
  }
}
