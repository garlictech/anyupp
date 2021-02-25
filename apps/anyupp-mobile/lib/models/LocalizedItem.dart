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

/** This is an auto generated class representing the LocalizedItem type in your schema. */
@immutable
class LocalizedItem extends Model {
  static const classType = const LocalizedItemType();
  final String id;
  final String en;
  final String de;
  final String hu;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const LocalizedItem._internal({@required this.id, this.en, this.de, this.hu});

  factory LocalizedItem({String id, String en, String de, String hu}) {
    return LocalizedItem._internal(
        id: id == null ? UUID.getUUID() : id, en: en, de: de, hu: hu);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LocalizedItem &&
        id == other.id &&
        en == other.en &&
        de == other.de &&
        hu == other.hu;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("LocalizedItem {");
    buffer.write("id=" + id + ", ");
    buffer.write("en=" + en + ", ");
    buffer.write("de=" + de + ", ");
    buffer.write("hu=" + hu);
    buffer.write("}");

    return buffer.toString();
  }

  LocalizedItem copyWith({String id, String en, String de, String hu}) {
    return LocalizedItem(
        id: id ?? this.id,
        en: en ?? this.en,
        de: de ?? this.de,
        hu: hu ?? this.hu);
  }

  LocalizedItem.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        en = json['en'],
        de = json['de'],
        hu = json['hu'];

  Map<String, dynamic> toJson() => {'id': id, 'en': en, 'de': de, 'hu': hu};

  static final QueryField ID = QueryField(fieldName: "localizedItem.id");
  static final QueryField EN = QueryField(fieldName: "en");
  static final QueryField DE = QueryField(fieldName: "de");
  static final QueryField HU = QueryField(fieldName: "hu");
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "LocalizedItem";
    modelSchemaDefinition.pluralName = "LocalizedItems";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: LocalizedItem.EN,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: LocalizedItem.DE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: LocalizedItem.HU,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));
  });
}

class LocalizedItemType extends ModelType<LocalizedItem> {
  const LocalizedItemType();

  @override
  LocalizedItem fromJson(Map<String, dynamic> jsonData) {
    return LocalizedItem.fromJson(jsonData);
  }
}
