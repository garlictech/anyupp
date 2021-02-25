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

/** This is an auto generated class representing the StripeCard type in your schema. */
@immutable
class StripeCard extends Model {
  static const classType = const StripeCardType();
  final String id;
  final CardBrand brand;
  final CardChecks checks;
  final String country;
  final String last4;
  final int exp_month;
  final int exp_year;
  final String fingerprint;
  final CardFundingType funding;
  final String three_d_secure;
  final String object;
  final List<StripeMetadata> metadata;

  @override
  getInstanceType() => classType;

  @override
  String getId() {
    return id;
  }

  const StripeCard._internal(
      {@required this.id,
      this.brand,
      this.checks,
      this.country,
      this.last4,
      this.exp_month,
      this.exp_year,
      this.fingerprint,
      this.funding,
      this.three_d_secure,
      @required this.object,
      @required this.metadata});

  factory StripeCard(
      {String id,
      CardBrand brand,
      CardChecks checks,
      String country,
      String last4,
      int exp_month,
      int exp_year,
      String fingerprint,
      CardFundingType funding,
      String three_d_secure,
      @required String object,
      @required List<StripeMetadata> metadata}) {
    return StripeCard._internal(
        id: id == null ? UUID.getUUID() : id,
        brand: brand,
        checks: checks,
        country: country,
        last4: last4,
        exp_month: exp_month,
        exp_year: exp_year,
        fingerprint: fingerprint,
        funding: funding,
        three_d_secure: three_d_secure,
        object: object,
        metadata: metadata != null ? List.unmodifiable(metadata) : metadata);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StripeCard &&
        id == other.id &&
        brand == other.brand &&
        checks == other.checks &&
        country == other.country &&
        last4 == other.last4 &&
        exp_month == other.exp_month &&
        exp_year == other.exp_year &&
        fingerprint == other.fingerprint &&
        funding == other.funding &&
        three_d_secure == other.three_d_secure &&
        object == other.object &&
        DeepCollectionEquality().equals(metadata, other.metadata);
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("StripeCard {");
    buffer.write("id=" + id + ", ");
    buffer.write("brand=" + enumToString(brand) + ", ");
    buffer.write(
        "checks=" + (checks != null ? checks.toString() : "null") + ", ");
    buffer.write("country=" + country + ", ");
    buffer.write("last4=" + last4 + ", ");
    buffer.write("exp_month=" +
        (exp_month != null ? exp_month.toString() : "null") +
        ", ");
    buffer.write(
        "exp_year=" + (exp_year != null ? exp_year.toString() : "null") + ", ");
    buffer.write("fingerprint=" + fingerprint + ", ");
    buffer.write("funding=" + enumToString(funding) + ", ");
    buffer.write("three_d_secure=" + three_d_secure + ", ");
    buffer.write("object=" + object);
    buffer.write("}");

    return buffer.toString();
  }

  StripeCard copyWith(
      {String id,
      CardBrand brand,
      CardChecks checks,
      String country,
      String last4,
      int exp_month,
      int exp_year,
      String fingerprint,
      CardFundingType funding,
      String three_d_secure,
      String object,
      List<StripeMetadata> metadata}) {
    return StripeCard(
        id: id ?? this.id,
        brand: brand ?? this.brand,
        checks: checks ?? this.checks,
        country: country ?? this.country,
        last4: last4 ?? this.last4,
        exp_month: exp_month ?? this.exp_month,
        exp_year: exp_year ?? this.exp_year,
        fingerprint: fingerprint ?? this.fingerprint,
        funding: funding ?? this.funding,
        three_d_secure: three_d_secure ?? this.three_d_secure,
        object: object ?? this.object,
        metadata: metadata ?? this.metadata);
  }

  StripeCard.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        brand = enumFromString<CardBrand>(json['brand'], CardBrand.values),
        checks = json['checks'] != null
            ? CardChecks.fromJson(new Map<String, dynamic>.from(json['checks']))
            : null,
        country = json['country'],
        last4 = json['last4'],
        exp_month = json['exp_month'],
        exp_year = json['exp_year'],
        fingerprint = json['fingerprint'],
        funding = enumFromString<CardFundingType>(
            json['funding'], CardFundingType.values),
        three_d_secure = json['three_d_secure'],
        object = json['object'],
        metadata = json['metadata'] is List
            ? (json['metadata'] as List)
                .map((e) =>
                    StripeMetadata.fromJson(new Map<String, dynamic>.from(e)))
                .toList()
            : null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'brand': enumToString(brand),
        'checks': checks?.toJson(),
        'country': country,
        'last4': last4,
        'exp_month': exp_month,
        'exp_year': exp_year,
        'fingerprint': fingerprint,
        'funding': enumToString(funding),
        'three_d_secure': three_d_secure,
        'object': object,
        'metadata': metadata?.map((e) => e?.toJson()).toList()
      };

  static final QueryField ID = QueryField(fieldName: "stripeCard.id");
  static final QueryField BRAND = QueryField(fieldName: "brand");
  static final QueryField CHECKS = QueryField(
      fieldName: "checks",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (CardChecks).toString()));
  static final QueryField COUNTRY = QueryField(fieldName: "country");
  static final QueryField LAST4 = QueryField(fieldName: "last4");
  static final QueryField EXP_MONTH = QueryField(fieldName: "exp_month");
  static final QueryField EXP_YEAR = QueryField(fieldName: "exp_year");
  static final QueryField FINGERPRINT = QueryField(fieldName: "fingerprint");
  static final QueryField FUNDING = QueryField(fieldName: "funding");
  static final QueryField THREE_D_SECURE =
      QueryField(fieldName: "three_d_secure");
  static final QueryField OBJECT = QueryField(fieldName: "object");
  static final QueryField METADATA = QueryField(
      fieldName: "metadata",
      fieldType: ModelFieldType(ModelFieldTypeEnum.model,
          ofModelName: (StripeMetadata).toString()));
  static var schema =
      Model.defineSchema(define: (ModelSchemaDefinition modelSchemaDefinition) {
    modelSchemaDefinition.name = "StripeCard";
    modelSchemaDefinition.pluralName = "StripeCards";

    modelSchemaDefinition.addField(ModelFieldDefinition.id());

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.BRAND,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.enumeration)));

    modelSchemaDefinition.addField(ModelFieldDefinition.belongsTo(
        key: StripeCard.CHECKS,
        isRequired: false,
        targetName: "stripeCardChecksId",
        ofModelName: (CardChecks).toString()));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.COUNTRY,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.LAST4,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.EXP_MONTH,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.EXP_YEAR,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.int)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.FINGERPRINT,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.FUNDING,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.enumeration)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.THREE_D_SECURE,
        isRequired: false,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.field(
        key: StripeCard.OBJECT,
        isRequired: true,
        ofType: ModelFieldType(ModelFieldTypeEnum.string)));

    modelSchemaDefinition.addField(ModelFieldDefinition.hasMany(
        key: StripeCard.METADATA,
        isRequired: true,
        ofModelName: (StripeMetadata).toString(),
        associatedKey: StripeMetadata.STRIPECARDMETADATAID));
  });
}

class StripeCardType extends ModelType<StripeCard> {
  const StripeCardType();

  @override
  StripeCard fromJson(Map<String, dynamic> jsonData) {
    return StripeCard.fromJson(jsonData);
  }
}
