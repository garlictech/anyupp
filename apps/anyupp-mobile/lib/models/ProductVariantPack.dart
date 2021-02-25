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

import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'package:flutter/foundation.dart';

/** This is an auto generated class representing the ProductVariantPack type in your schema. */
@immutable
class ProductVariantPack extends Model {
  static const classType = const ProductVariantPackType();
  final String id;
  final double size;
  final String unit;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ProductVariantPack._internal({@required this.id, this.size, this.unit});

  factory ProductVariantPack({String id, double size, String unit}) {
    return ProductVariantPack._internal(
        id: id == null ? UUID.getUUID() : id, size: size, unit: unit);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProductVariantPack &&
        id == other.id &&
        size == other.size &&
        unit == other.unit;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ProductVariantPack {");
    buffer.write("id=" + id + ", ");
    buffer.write("size=" + (size != null ? size.toString() : "null") + ", ");
    buffer.write("unit=" + unit);
    buffer.write("}");

    return buffer.toString();
  }

  ProductVariantPack copyWith({String id, double size, String unit}) {
    return ProductVariantPack(
        id: id ?? this.id, size: size ?? this.size, unit: unit ?? this.unit);
  }

  ProductVariantPack.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        size = json['size'],
        unit = json['unit'];

  Map<String, dynamic> toJson() => {'id': id, 'size': size, 'unit': unit};

  static final QueryField ID = QueryField(fieldName: "productVariantPack.id");
  static final QueryField SIZE = QueryField(fieldName: "size");
  static final QueryField UNIT = QueryField(fieldName: "unit");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ProductVariantPack";
    modelSchemaDefinition.pluralName = "ProductVariantPacks";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariantPack.SIZE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.double)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ProductVariantPack.UNIT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class ProductVariantPackType extends ModelType<ProductVariantPack> {
  const ProductVariantPackType();

  @override
  ProductVariantPack fromJson(Map<String, dynamic> jsonData) {
    return ProductVariantPack.fromJson(jsonData);
  }
}
