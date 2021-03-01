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

/** This is an auto generated class representing the ChainStyleImages type in your schema. */
@immutable
class ChainStyleImages extends Model {
  static const classType = const ChainStyleImagesType();
  final String id;
  final String header;
  final String logo;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const ChainStyleImages._internal({@required this.id, this.header, this.logo});

  factory ChainStyleImages({String id, String header, String logo}) {
    return ChainStyleImages._internal(
        id: id == null ? UUID.getUUID() : id, header: header, logo: logo);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChainStyleImages &&
        id == other.id &&
        header == other.header &&
        logo == other.logo;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("ChainStyleImages {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("header=" + "$header" + ", ");
    buffer.write("logo=" + "$logo");
    buffer.write("}");

    return buffer.toString();
  }

  ChainStyleImages copyWith({String id, String header, String logo}) {
    return ChainStyleImages(
        id: id ?? this.id,
        header: header ?? this.header,
        logo: logo ?? this.logo);
  }

  ChainStyleImages.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        header = json['header'],
        logo = json['logo'];

  Map<String, dynamic> toJson() => {'id': id, 'header': header, 'logo': logo};

  static final QueryField ID = QueryField(fieldName: "chainStyleImages.id");
  static final QueryField HEADER = QueryField(fieldName: "header");
  static final QueryField LOGO = QueryField(fieldName: "logo");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "ChainStyleImages";
    modelSchemaDefinition.pluralName = "ChainStyleImages";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleImages.HEADER,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: ChainStyleImages.LOGO,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class ChainStyleImagesType extends ModelType<ChainStyleImages> {
  const ChainStyleImagesType();

  @override
  ChainStyleImages fromJson(Map<String, dynamic> jsonData) {
    return ChainStyleImages.fromJson(jsonData);
  }
}
