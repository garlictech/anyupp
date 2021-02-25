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

/** This is an auto generated class representing the Chain type in your schema. */
@immutable
class Chain extends Model {
  static const classType = const ChainType();
  final String id;
  final String name;
  final LocalizedItem description;
  final ChainStyle style;
  final bool isActive;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const Chain._internal(
      {@required this.id,
      this.name,
      this.description,
      this.style,
      this.isActive});

  factory Chain(
      {String id,
      String name,
      LocalizedItem description,
      ChainStyle style,
      bool isActive}) {
    return Chain._internal(
        id: id == null ? UUID.getUUID() : id,
        name: name,
        description: description,
        style: style,
        isActive: isActive);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Chain &&
        id == other.id &&
        name == other.name &&
        description == other.description &&
        style == other.style &&
        isActive == other.isActive;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Chain {");
    buffer.write("id=" + id + ", ");
    buffer.write("name=" + name + ", ");
    buffer.write("description=" +
        (description != null ? description.toString() : "null") +
        ", ");
    buffer.write("style=" + (style != null ? style.toString() : "null") + ", ");
    buffer
        .write("isActive=" + (isActive != null ? isActive.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Chain copyWith(
      {String id,
      String name,
      LocalizedItem description,
      ChainStyle style,
      bool isActive}) {
    return Chain(
        id: id ?? this.id,
        name: name ?? this.name,
        description: description ?? this.description,
        style: style ?? this.style,
        isActive: isActive ?? this.isActive);
  }

  Chain.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        description = json['description'] != null
            ? LocalizedItem.fromJson(
                new Map<String, dynamic>.from(json['description']))
            : null,
        style = json['style'] != null
            ? ChainStyle.fromJson(new Map<String, dynamic>.from(json['style']))
            : null,
        isActive = json['isActive'];

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description?.toJson(),
        'style': style?.toJson(),
        'isActive': isActive
      };

  static final QueryField ID = QueryField(fieldName: "chain.id");
  static final QueryField NAME = QueryField(fieldName: "name");
  static final QueryField DESCRIPTION = QueryField(
      fieldName: "description",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (LocalizedItem).toString()));
  static final QueryField STYLE = QueryField(
      fieldName: "style",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (ChainStyle).toString()));
  static final QueryField ISACTIVE = QueryField(fieldName: "isActive");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "Chain";
    modelSchemaDefinition.pluralName = "Chains";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Chain.NAME,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Chain.DESCRIPTION,
        isRequired: false,
        targetName: "chainDescriptionId",
        ofModelName: (LocalizedItem).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: Chain.STYLE,
        isRequired: false,
        targetName: "chainStyleId",
        ofModelName: (ChainStyle).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: Chain.ISACTIVE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.bool)));
  });
}

class ChainType extends ModelType<Chain> {
  const ChainType();

  @override
  Chain fromJson(Map<String, dynamic> jsonData) {
    return Chain.fromJson(jsonData);
  }
}
