// GENERATED CODE - DO NOT MODIFY BY HAND

import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:fa_prev/schema/serializers.gql.dart' as _i1;

part 'schema-test.schema.gql.g.dart';

class GOrderStatus extends EnumClass {
  const GOrderStatus._(String name) : super(name);

  static const GOrderStatus PLACED = _$gOrderStatusPLACED;

  static const GOrderStatus PROCESSING = _$gOrderStatusPROCESSING;

  static const GOrderStatus READY = _$gOrderStatusREADY;

  static const GOrderStatus PAID = _$gOrderStatusPAID;

  static const GOrderStatus REJECTED = _$gOrderStatusREJECTED;

  static Serializer<GOrderStatus> get serializer => _$gOrderStatusSerializer;
  static BuiltSet<GOrderStatus> get values => _$gOrderStatusValues;
  static GOrderStatus valueOf(String name) => _$gOrderStatusValueOf(name);
}

abstract class GAddressInput
    implements Built<GAddressInput, GAddressInputBuilder> {
  GAddressInput._();

  factory GAddressInput([Function(GAddressInputBuilder b) updates]) =
      _$GAddressInput;

  @nullable
  String get address;
  @nullable
  String get city;
  @nullable
  String get country;
  @nullable
  String get title;
  @nullable
  String get postalCode;
  @nullable
  GLocationInput get location;
  static Serializer<GAddressInput> get serializer => _$gAddressInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GAddressInput.serializer, this);
  static GAddressInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GAddressInput.serializer, json);
}

abstract class GLocationInput
    implements Built<GLocationInput, GLocationInputBuilder> {
  GLocationInput._();

  factory GLocationInput([Function(GLocationInputBuilder b) updates]) =
      _$GLocationInput;

  @nullable
  double get lat;
  @nullable
  double get lng;
  static Serializer<GLocationInput> get serializer =>
      _$gLocationInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GLocationInput.serializer, this);
  static GLocationInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GLocationInput.serializer, json);
}

abstract class GChainStyleInput
    implements Built<GChainStyleInput, GChainStyleInputBuilder> {
  GChainStyleInput._();

  factory GChainStyleInput([Function(GChainStyleInputBuilder b) updates]) =
      _$GChainStyleInput;

  @nullable
  GChainStyleColorsInput get colors;
  @nullable
  GChainStyleImagesInput get images;
  static Serializer<GChainStyleInput> get serializer =>
      _$gChainStyleInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GChainStyleInput.serializer, this);
  static GChainStyleInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GChainStyleInput.serializer, json);
}

abstract class GChainStyleColorsInput
    implements Built<GChainStyleColorsInput, GChainStyleColorsInputBuilder> {
  GChainStyleColorsInput._();

  factory GChainStyleColorsInput(
          [Function(GChainStyleColorsInputBuilder b) updates]) =
      _$GChainStyleColorsInput;

  @nullable
  String get backgroundLight;
  @nullable
  String get backgroundDark;
  @nullable
  String get borderLight;
  @nullable
  String get borderDark;
  @nullable
  String get disabled;
  @nullable
  String get highlight;
  @nullable
  String get indicator;
  @nullable
  String get textLight;
  @nullable
  String get textDark;
  static Serializer<GChainStyleColorsInput> get serializer =>
      _$gChainStyleColorsInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GChainStyleColorsInput.serializer, this);
  static GChainStyleColorsInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GChainStyleColorsInput.serializer, json);
}

abstract class GChainStyleImagesInput
    implements Built<GChainStyleImagesInput, GChainStyleImagesInputBuilder> {
  GChainStyleImagesInput._();

  factory GChainStyleImagesInput(
          [Function(GChainStyleImagesInputBuilder b) updates]) =
      _$GChainStyleImagesInput;

  @nullable
  String get header;
  @nullable
  String get logo;
  static Serializer<GChainStyleImagesInput> get serializer =>
      _$gChainStyleImagesInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GChainStyleImagesInput.serializer, this);
  static GChainStyleImagesInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GChainStyleImagesInput.serializer, json);
}

abstract class GPaymentModeInput
    implements Built<GPaymentModeInput, GPaymentModeInputBuilder> {
  GPaymentModeInput._();

  factory GPaymentModeInput([Function(GPaymentModeInputBuilder b) updates]) =
      _$GPaymentModeInput;

  String get name;
  @nullable
  String get caption;
  String get method;
  static Serializer<GPaymentModeInput> get serializer =>
      _$gPaymentModeInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GPaymentModeInput.serializer, this);
  static GPaymentModeInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GPaymentModeInput.serializer, json);
}

abstract class GPlaceInput implements Built<GPlaceInput, GPlaceInputBuilder> {
  GPlaceInput._();

  factory GPlaceInput([Function(GPlaceInputBuilder b) updates]) = _$GPlaceInput;

  @nullable
  String get seat;
  @nullable
  String get table;
  static Serializer<GPlaceInput> get serializer => _$gPlaceInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GPlaceInput.serializer, this);
  static GPlaceInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GPlaceInput.serializer, json);
}

class GModelSortDirection extends EnumClass {
  const GModelSortDirection._(String name) : super(name);

  static const GModelSortDirection ASC = _$gModelSortDirectionASC;

  static const GModelSortDirection DESC = _$gModelSortDirectionDESC;

  static Serializer<GModelSortDirection> get serializer =>
      _$gModelSortDirectionSerializer;
  static BuiltSet<GModelSortDirection> get values =>
      _$gModelSortDirectionValues;
  static GModelSortDirection valueOf(String name) =>
      _$gModelSortDirectionValueOf(name);
}

abstract class GModelStringInput
    implements Built<GModelStringInput, GModelStringInputBuilder> {
  GModelStringInput._();

  factory GModelStringInput([Function(GModelStringInputBuilder b) updates]) =
      _$GModelStringInput;

  @nullable
  String get ne;
  @nullable
  String get eq;
  @nullable
  String get le;
  @nullable
  String get lt;
  @nullable
  String get ge;
  @nullable
  String get gt;
  @nullable
  String get contains;
  @nullable
  String get notContains;
  @nullable
  BuiltList<String> get between;
  @nullable
  String get beginsWith;
  @nullable
  bool get attributeExists;
  @nullable
  GModelAttributeTypes get attributeType;
  @nullable
  GModelSizeInput get size;
  static Serializer<GModelStringInput> get serializer =>
      _$gModelStringInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelStringInput.serializer, this);
  static GModelStringInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelStringInput.serializer, json);
}

abstract class GModelIDInput
    implements Built<GModelIDInput, GModelIDInputBuilder> {
  GModelIDInput._();

  factory GModelIDInput([Function(GModelIDInputBuilder b) updates]) =
      _$GModelIDInput;

  @nullable
  String get ne;
  @nullable
  String get eq;
  @nullable
  String get le;
  @nullable
  String get lt;
  @nullable
  String get ge;
  @nullable
  String get gt;
  @nullable
  String get contains;
  @nullable
  String get notContains;
  @nullable
  BuiltList<String> get between;
  @nullable
  String get beginsWith;
  @nullable
  bool get attributeExists;
  @nullable
  GModelAttributeTypes get attributeType;
  @nullable
  GModelSizeInput get size;
  static Serializer<GModelIDInput> get serializer => _$gModelIDInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelIDInput.serializer, this);
  static GModelIDInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelIDInput.serializer, json);
}

abstract class GModelIntInput
    implements Built<GModelIntInput, GModelIntInputBuilder> {
  GModelIntInput._();

  factory GModelIntInput([Function(GModelIntInputBuilder b) updates]) =
      _$GModelIntInput;

  @nullable
  int get ne;
  @nullable
  int get eq;
  @nullable
  int get le;
  @nullable
  int get lt;
  @nullable
  int get ge;
  @nullable
  int get gt;
  @nullable
  BuiltList<int> get between;
  @nullable
  bool get attributeExists;
  @nullable
  GModelAttributeTypes get attributeType;
  static Serializer<GModelIntInput> get serializer =>
      _$gModelIntInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelIntInput.serializer, this);
  static GModelIntInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelIntInput.serializer, json);
}

abstract class GModelFloatInput
    implements Built<GModelFloatInput, GModelFloatInputBuilder> {
  GModelFloatInput._();

  factory GModelFloatInput([Function(GModelFloatInputBuilder b) updates]) =
      _$GModelFloatInput;

  @nullable
  double get ne;
  @nullable
  double get eq;
  @nullable
  double get le;
  @nullable
  double get lt;
  @nullable
  double get ge;
  @nullable
  double get gt;
  @nullable
  BuiltList<double> get between;
  @nullable
  bool get attributeExists;
  @nullable
  GModelAttributeTypes get attributeType;
  static Serializer<GModelFloatInput> get serializer =>
      _$gModelFloatInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelFloatInput.serializer, this);
  static GModelFloatInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelFloatInput.serializer, json);
}

abstract class GModelBooleanInput
    implements Built<GModelBooleanInput, GModelBooleanInputBuilder> {
  GModelBooleanInput._();

  factory GModelBooleanInput([Function(GModelBooleanInputBuilder b) updates]) =
      _$GModelBooleanInput;

  @nullable
  bool get ne;
  @nullable
  bool get eq;
  @nullable
  bool get attributeExists;
  @nullable
  GModelAttributeTypes get attributeType;
  static Serializer<GModelBooleanInput> get serializer =>
      _$gModelBooleanInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelBooleanInput.serializer, this);
  static GModelBooleanInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelBooleanInput.serializer, json);
}

abstract class GModelSizeInput
    implements Built<GModelSizeInput, GModelSizeInputBuilder> {
  GModelSizeInput._();

  factory GModelSizeInput([Function(GModelSizeInputBuilder b) updates]) =
      _$GModelSizeInput;

  @nullable
  int get ne;
  @nullable
  int get eq;
  @nullable
  int get le;
  @nullable
  int get lt;
  @nullable
  int get ge;
  @nullable
  int get gt;
  @nullable
  BuiltList<int> get between;
  static Serializer<GModelSizeInput> get serializer =>
      _$gModelSizeInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelSizeInput.serializer, this);
  static GModelSizeInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelSizeInput.serializer, json);
}

abstract class GModelGeoUnitFilterInput
    implements
        Built<GModelGeoUnitFilterInput, GModelGeoUnitFilterInputBuilder> {
  GModelGeoUnitFilterInput._();

  factory GModelGeoUnitFilterInput(
          [Function(GModelGeoUnitFilterInputBuilder b) updates]) =
      _$GModelGeoUnitFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get groupId;
  @nullable
  GModelIDInput get chainId;
  @nullable
  GModelStringInput get name;
  @nullable
  GModelIntInput get distance;
  @nullable
  GModelStringInput get openingHours;
  @nullable
  GModelStringInput get currency;
  @nullable
  BuiltList<GModelGeoUnitFilterInput> get and;
  @nullable
  BuiltList<GModelGeoUnitFilterInput> get or;
  @nullable
  GModelGeoUnitFilterInput get not;
  static Serializer<GModelGeoUnitFilterInput> get serializer =>
      _$gModelGeoUnitFilterInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelGeoUnitFilterInput.serializer, this);
  static GModelGeoUnitFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelGeoUnitFilterInput.serializer, json);
}

class GModelAttributeTypes extends EnumClass {
  const GModelAttributeTypes._(String name) : super(name);

  static const GModelAttributeTypes binary = _$gModelAttributeTypesbinary;

  static const GModelAttributeTypes binarySet = _$gModelAttributeTypesbinarySet;

  @BuiltValueEnumConst(wireName: 'bool')
  static const GModelAttributeTypes Gbool = _$gModelAttributeTypesGbool;

  static const GModelAttributeTypes list = _$gModelAttributeTypeslist;

  static const GModelAttributeTypes map = _$gModelAttributeTypesmap;

  static const GModelAttributeTypes number = _$gModelAttributeTypesnumber;

  static const GModelAttributeTypes numberSet = _$gModelAttributeTypesnumberSet;

  static const GModelAttributeTypes string = _$gModelAttributeTypesstring;

  static const GModelAttributeTypes stringSet = _$gModelAttributeTypesstringSet;

  @BuiltValueEnumConst(wireName: '_null')
  static const GModelAttributeTypes G_null = _$gModelAttributeTypesG_null;

  static Serializer<GModelAttributeTypes> get serializer =>
      _$gModelAttributeTypesSerializer;
  static BuiltSet<GModelAttributeTypes> get values =>
      _$gModelAttributeTypesValues;
  static GModelAttributeTypes valueOf(String name) =>
      _$gModelAttributeTypesValueOf(name);
}

abstract class GCreateGeoUnitInput
    implements Built<GCreateGeoUnitInput, GCreateGeoUnitInputBuilder> {
  GCreateGeoUnitInput._();

  factory GCreateGeoUnitInput(
      [Function(GCreateGeoUnitInputBuilder b) updates]) = _$GCreateGeoUnitInput;

  @nullable
  String get id;
  String get groupId;
  String get chainId;
  @nullable
  String get name;
  @nullable
  GAddressInput get address;
  @nullable
  GChainStyleInput get style;
  BuiltList<GPaymentModeInput> get paymentModes;
  @nullable
  int get distance;
  @nullable
  String get openingHours;
  @nullable
  String get currency;
  @nullable
  GPlaceInput get place;
  static Serializer<GCreateGeoUnitInput> get serializer =>
      _$gCreateGeoUnitInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GCreateGeoUnitInput.serializer, this);
  static GCreateGeoUnitInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GCreateGeoUnitInput.serializer, json);
}

abstract class GUpdateGeoUnitInput
    implements Built<GUpdateGeoUnitInput, GUpdateGeoUnitInputBuilder> {
  GUpdateGeoUnitInput._();

  factory GUpdateGeoUnitInput(
      [Function(GUpdateGeoUnitInputBuilder b) updates]) = _$GUpdateGeoUnitInput;

  String get id;
  @nullable
  String get groupId;
  @nullable
  String get chainId;
  @nullable
  String get name;
  @nullable
  GAddressInput get address;
  @nullable
  GChainStyleInput get style;
  BuiltList<GPaymentModeInput> get paymentModes;
  @nullable
  int get distance;
  @nullable
  String get openingHours;
  @nullable
  String get currency;
  @nullable
  GPlaceInput get place;
  static Serializer<GUpdateGeoUnitInput> get serializer =>
      _$gUpdateGeoUnitInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GUpdateGeoUnitInput.serializer, this);
  static GUpdateGeoUnitInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GUpdateGeoUnitInput.serializer, json);
}

abstract class GDeleteGeoUnitInput
    implements Built<GDeleteGeoUnitInput, GDeleteGeoUnitInputBuilder> {
  GDeleteGeoUnitInput._();

  factory GDeleteGeoUnitInput(
      [Function(GDeleteGeoUnitInputBuilder b) updates]) = _$GDeleteGeoUnitInput;

  @nullable
  String get id;
  static Serializer<GDeleteGeoUnitInput> get serializer =>
      _$gDeleteGeoUnitInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GDeleteGeoUnitInput.serializer, this);
  static GDeleteGeoUnitInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GDeleteGeoUnitInput.serializer, json);
}

abstract class GModelGeoUnitConditionInput
    implements
        Built<GModelGeoUnitConditionInput, GModelGeoUnitConditionInputBuilder> {
  GModelGeoUnitConditionInput._();

  factory GModelGeoUnitConditionInput(
          [Function(GModelGeoUnitConditionInputBuilder b) updates]) =
      _$GModelGeoUnitConditionInput;

  @nullable
  GModelIDInput get groupId;
  @nullable
  GModelIDInput get chainId;
  @nullable
  GModelStringInput get name;
  @nullable
  GModelIntInput get distance;
  @nullable
  GModelStringInput get openingHours;
  @nullable
  GModelStringInput get currency;
  @nullable
  BuiltList<GModelGeoUnitConditionInput> get and;
  @nullable
  BuiltList<GModelGeoUnitConditionInput> get or;
  @nullable
  GModelGeoUnitConditionInput get not;
  static Serializer<GModelGeoUnitConditionInput> get serializer =>
      _$gModelGeoUnitConditionInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelGeoUnitConditionInput.serializer, this);
  static GModelGeoUnitConditionInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelGeoUnitConditionInput.serializer, json);
}

abstract class GModelUserFilterInput
    implements Built<GModelUserFilterInput, GModelUserFilterInputBuilder> {
  GModelUserFilterInput._();

  factory GModelUserFilterInput(
          [Function(GModelUserFilterInputBuilder b) updates]) =
      _$GModelUserFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelStringInput get name;
  @nullable
  GModelStringInput get email;
  @nullable
  GModelStringInput get phone;
  @nullable
  GModelStringInput get profileImage;
  @nullable
  GModelStringInput get loginMethod;
  @nullable
  BuiltList<GModelUserFilterInput> get and;
  @nullable
  BuiltList<GModelUserFilterInput> get or;
  @nullable
  GModelUserFilterInput get not;
  static Serializer<GModelUserFilterInput> get serializer =>
      _$gModelUserFilterInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelUserFilterInput.serializer, this);
  static GModelUserFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelUserFilterInput.serializer, json);
}

abstract class GCreateUserInput
    implements Built<GCreateUserInput, GCreateUserInputBuilder> {
  GCreateUserInput._();

  factory GCreateUserInput([Function(GCreateUserInputBuilder b) updates]) =
      _$GCreateUserInput;

  @nullable
  String get id;
  @nullable
  String get name;
  @nullable
  String get email;
  @nullable
  String get phone;
  @nullable
  String get profileImage;
  @nullable
  String get loginMethod;
  static Serializer<GCreateUserInput> get serializer =>
      _$gCreateUserInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GCreateUserInput.serializer, this);
  static GCreateUserInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GCreateUserInput.serializer, json);
}

abstract class GUpdateUserInput
    implements Built<GUpdateUserInput, GUpdateUserInputBuilder> {
  GUpdateUserInput._();

  factory GUpdateUserInput([Function(GUpdateUserInputBuilder b) updates]) =
      _$GUpdateUserInput;

  String get id;
  @nullable
  String get name;
  @nullable
  String get email;
  @nullable
  String get phone;
  @nullable
  String get profileImage;
  @nullable
  String get loginMethod;
  static Serializer<GUpdateUserInput> get serializer =>
      _$gUpdateUserInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GUpdateUserInput.serializer, this);
  static GUpdateUserInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GUpdateUserInput.serializer, json);
}

abstract class GDeleteUserInput
    implements Built<GDeleteUserInput, GDeleteUserInputBuilder> {
  GDeleteUserInput._();

  factory GDeleteUserInput([Function(GDeleteUserInputBuilder b) updates]) =
      _$GDeleteUserInput;

  @nullable
  String get id;
  static Serializer<GDeleteUserInput> get serializer =>
      _$gDeleteUserInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GDeleteUserInput.serializer, this);
  static GDeleteUserInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GDeleteUserInput.serializer, json);
}

abstract class GModelUserConditionInput
    implements
        Built<GModelUserConditionInput, GModelUserConditionInputBuilder> {
  GModelUserConditionInput._();

  factory GModelUserConditionInput(
          [Function(GModelUserConditionInputBuilder b) updates]) =
      _$GModelUserConditionInput;

  @nullable
  GModelStringInput get name;
  @nullable
  GModelStringInput get email;
  @nullable
  GModelStringInput get phone;
  @nullable
  GModelStringInput get profileImage;
  @nullable
  GModelStringInput get loginMethod;
  @nullable
  BuiltList<GModelUserConditionInput> get and;
  @nullable
  BuiltList<GModelUserConditionInput> get or;
  @nullable
  GModelUserConditionInput get not;
  static Serializer<GModelUserConditionInput> get serializer =>
      _$gModelUserConditionInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelUserConditionInput.serializer, this);
  static GModelUserConditionInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelUserConditionInput.serializer, json);
}

abstract class GLocalizedItemInput
    implements Built<GLocalizedItemInput, GLocalizedItemInputBuilder> {
  GLocalizedItemInput._();

  factory GLocalizedItemInput(
      [Function(GLocalizedItemInputBuilder b) updates]) = _$GLocalizedItemInput;

  @nullable
  String get en;
  @nullable
  String get de;
  @nullable
  String get hu;
  static Serializer<GLocalizedItemInput> get serializer =>
      _$gLocalizedItemInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GLocalizedItemInput.serializer, this);
  static GLocalizedItemInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GLocalizedItemInput.serializer, json);
}

abstract class GProductVariantInput
    implements Built<GProductVariantInput, GProductVariantInputBuilder> {
  GProductVariantInput._();

  factory GProductVariantInput(
          [Function(GProductVariantInputBuilder b) updates]) =
      _$GProductVariantInput;

  @nullable
  GLocalizedItemInput get variantName;
  @nullable
  GProductVariantPackInput get pack;
  @nullable
  bool get isAvailable;
  @nullable
  double get price;
  @nullable
  int get position;
  static Serializer<GProductVariantInput> get serializer =>
      _$gProductVariantInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GProductVariantInput.serializer, this);
  static GProductVariantInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GProductVariantInput.serializer, json);
}

abstract class GProductVariantPackInput
    implements
        Built<GProductVariantPackInput, GProductVariantPackInputBuilder> {
  GProductVariantPackInput._();

  factory GProductVariantPackInput(
          [Function(GProductVariantPackInputBuilder b) updates]) =
      _$GProductVariantPackInput;

  @nullable
  double get size;
  @nullable
  String get unit;
  static Serializer<GProductVariantPackInput> get serializer =>
      _$gProductVariantPackInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GProductVariantPackInput.serializer, this);
  static GProductVariantPackInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GProductVariantPackInput.serializer, json);
}

abstract class GModelGeneratedProductFilterInput
    implements
        Built<GModelGeneratedProductFilterInput,
            GModelGeneratedProductFilterInputBuilder> {
  GModelGeneratedProductFilterInput._();

  factory GModelGeneratedProductFilterInput(
          [Function(GModelGeneratedProductFilterInputBuilder b) updates]) =
      _$GModelGeneratedProductFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelIDInput get productCategoryId;
  @nullable
  GModelStringInput get productType;
  @nullable
  GModelIntInput get tax;
  @nullable
  GModelIntInput get position;
  @nullable
  GModelStringInput get image;
  @nullable
  BuiltList<GModelGeneratedProductFilterInput> get and;
  @nullable
  BuiltList<GModelGeneratedProductFilterInput> get or;
  @nullable
  GModelGeneratedProductFilterInput get not;
  static Serializer<GModelGeneratedProductFilterInput> get serializer =>
      _$gModelGeneratedProductFilterInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelGeneratedProductFilterInput.serializer, this);
  static GModelGeneratedProductFilterInput fromJson(
          Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelGeneratedProductFilterInput.serializer, json);
}

abstract class GCreateGeneratedProductInput
    implements
        Built<GCreateGeneratedProductInput,
            GCreateGeneratedProductInputBuilder> {
  GCreateGeneratedProductInput._();

  factory GCreateGeneratedProductInput(
          [Function(GCreateGeneratedProductInputBuilder b) updates]) =
      _$GCreateGeneratedProductInput;

  @nullable
  String get id;
  String get unitId;
  String get productCategoryId;
  @nullable
  GLocalizedItemInput get name;
  @nullable
  GLocalizedItemInput get description;
  @nullable
  String get productType;
  @nullable
  int get tax;
  @nullable
  int get position;
  @nullable
  String get image;
  BuiltList<GProductVariantInput> get variants;
  static Serializer<GCreateGeneratedProductInput> get serializer =>
      _$gCreateGeneratedProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GCreateGeneratedProductInput.serializer, this);
  static GCreateGeneratedProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GCreateGeneratedProductInput.serializer, json);
}

abstract class GUpdateGeneratedProductInput
    implements
        Built<GUpdateGeneratedProductInput,
            GUpdateGeneratedProductInputBuilder> {
  GUpdateGeneratedProductInput._();

  factory GUpdateGeneratedProductInput(
          [Function(GUpdateGeneratedProductInputBuilder b) updates]) =
      _$GUpdateGeneratedProductInput;

  String get id;
  @nullable
  String get unitId;
  @nullable
  String get productCategoryId;
  @nullable
  GLocalizedItemInput get name;
  @nullable
  GLocalizedItemInput get description;
  @nullable
  String get productType;
  @nullable
  int get tax;
  @nullable
  int get position;
  @nullable
  String get image;
  BuiltList<GProductVariantInput> get variants;
  static Serializer<GUpdateGeneratedProductInput> get serializer =>
      _$gUpdateGeneratedProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GUpdateGeneratedProductInput.serializer, this);
  static GUpdateGeneratedProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GUpdateGeneratedProductInput.serializer, json);
}

abstract class GDeleteGeneratedProductInput
    implements
        Built<GDeleteGeneratedProductInput,
            GDeleteGeneratedProductInputBuilder> {
  GDeleteGeneratedProductInput._();

  factory GDeleteGeneratedProductInput(
          [Function(GDeleteGeneratedProductInputBuilder b) updates]) =
      _$GDeleteGeneratedProductInput;

  @nullable
  String get id;
  static Serializer<GDeleteGeneratedProductInput> get serializer =>
      _$gDeleteGeneratedProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GDeleteGeneratedProductInput.serializer, this);
  static GDeleteGeneratedProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GDeleteGeneratedProductInput.serializer, json);
}

abstract class GModelGeneratedProductConditionInput
    implements
        Built<GModelGeneratedProductConditionInput,
            GModelGeneratedProductConditionInputBuilder> {
  GModelGeneratedProductConditionInput._();

  factory GModelGeneratedProductConditionInput(
          [Function(GModelGeneratedProductConditionInputBuilder b) updates]) =
      _$GModelGeneratedProductConditionInput;

  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelIDInput get productCategoryId;
  @nullable
  GModelStringInput get productType;
  @nullable
  GModelIntInput get tax;
  @nullable
  GModelIntInput get position;
  @nullable
  GModelStringInput get image;
  @nullable
  BuiltList<GModelGeneratedProductConditionInput> get and;
  @nullable
  BuiltList<GModelGeneratedProductConditionInput> get or;
  @nullable
  GModelGeneratedProductConditionInput get not;
  static Serializer<GModelGeneratedProductConditionInput> get serializer =>
      _$gModelGeneratedProductConditionInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelGeneratedProductConditionInput.serializer, this);
  static GModelGeneratedProductConditionInput fromJson(
          Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(
          GModelGeneratedProductConditionInput.serializer, json);
}

abstract class GModelProductCategoryFilterInput
    implements
        Built<GModelProductCategoryFilterInput,
            GModelProductCategoryFilterInputBuilder> {
  GModelProductCategoryFilterInput._();

  factory GModelProductCategoryFilterInput(
          [Function(GModelProductCategoryFilterInputBuilder b) updates]) =
      _$GModelProductCategoryFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelStringInput get image;
  @nullable
  GModelIntInput get position;
  @nullable
  BuiltList<GModelProductCategoryFilterInput> get and;
  @nullable
  BuiltList<GModelProductCategoryFilterInput> get or;
  @nullable
  GModelProductCategoryFilterInput get not;
  static Serializer<GModelProductCategoryFilterInput> get serializer =>
      _$gModelProductCategoryFilterInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelProductCategoryFilterInput.serializer, this);
  static GModelProductCategoryFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelProductCategoryFilterInput.serializer, json);
}

abstract class GCreateProductCategoryInput
    implements
        Built<GCreateProductCategoryInput, GCreateProductCategoryInputBuilder> {
  GCreateProductCategoryInput._();

  factory GCreateProductCategoryInput(
          [Function(GCreateProductCategoryInputBuilder b) updates]) =
      _$GCreateProductCategoryInput;

  @nullable
  String get id;
  String get unitId;
  @nullable
  GLocalizedItemInput get name;
  @nullable
  GLocalizedItemInput get description;
  @nullable
  String get image;
  @nullable
  int get position;
  static Serializer<GCreateProductCategoryInput> get serializer =>
      _$gCreateProductCategoryInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GCreateProductCategoryInput.serializer, this);
  static GCreateProductCategoryInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GCreateProductCategoryInput.serializer, json);
}

abstract class GUpdateProductCategoryInput
    implements
        Built<GUpdateProductCategoryInput, GUpdateProductCategoryInputBuilder> {
  GUpdateProductCategoryInput._();

  factory GUpdateProductCategoryInput(
          [Function(GUpdateProductCategoryInputBuilder b) updates]) =
      _$GUpdateProductCategoryInput;

  String get id;
  @nullable
  String get unitId;
  @nullable
  GLocalizedItemInput get name;
  @nullable
  GLocalizedItemInput get description;
  @nullable
  String get image;
  @nullable
  int get position;
  static Serializer<GUpdateProductCategoryInput> get serializer =>
      _$gUpdateProductCategoryInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GUpdateProductCategoryInput.serializer, this);
  static GUpdateProductCategoryInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GUpdateProductCategoryInput.serializer, json);
}

abstract class GDeleteProductCategoryInput
    implements
        Built<GDeleteProductCategoryInput, GDeleteProductCategoryInputBuilder> {
  GDeleteProductCategoryInput._();

  factory GDeleteProductCategoryInput(
          [Function(GDeleteProductCategoryInputBuilder b) updates]) =
      _$GDeleteProductCategoryInput;

  @nullable
  String get id;
  static Serializer<GDeleteProductCategoryInput> get serializer =>
      _$gDeleteProductCategoryInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GDeleteProductCategoryInput.serializer, this);
  static GDeleteProductCategoryInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GDeleteProductCategoryInput.serializer, json);
}

abstract class GModelProductCategoryConditionInput
    implements
        Built<GModelProductCategoryConditionInput,
            GModelProductCategoryConditionInputBuilder> {
  GModelProductCategoryConditionInput._();

  factory GModelProductCategoryConditionInput(
          [Function(GModelProductCategoryConditionInputBuilder b) updates]) =
      _$GModelProductCategoryConditionInput;

  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelStringInput get image;
  @nullable
  GModelIntInput get position;
  @nullable
  BuiltList<GModelProductCategoryConditionInput> get and;
  @nullable
  BuiltList<GModelProductCategoryConditionInput> get or;
  @nullable
  GModelProductCategoryConditionInput get not;
  static Serializer<GModelProductCategoryConditionInput> get serializer =>
      _$gModelProductCategoryConditionInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelProductCategoryConditionInput.serializer, this);
  static GModelProductCategoryConditionInput fromJson(
          Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(
          GModelProductCategoryConditionInput.serializer, json);
}

abstract class GModelFavoriteProductFilterInput
    implements
        Built<GModelFavoriteProductFilterInput,
            GModelFavoriteProductFilterInputBuilder> {
  GModelFavoriteProductFilterInput._();

  factory GModelFavoriteProductFilterInput(
          [Function(GModelFavoriteProductFilterInputBuilder b) updates]) =
      _$GModelFavoriteProductFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  BuiltList<GModelFavoriteProductFilterInput> get and;
  @nullable
  BuiltList<GModelFavoriteProductFilterInput> get or;
  @nullable
  GModelFavoriteProductFilterInput get not;
  static Serializer<GModelFavoriteProductFilterInput> get serializer =>
      _$gModelFavoriteProductFilterInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelFavoriteProductFilterInput.serializer, this);
  static GModelFavoriteProductFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelFavoriteProductFilterInput.serializer, json);
}

abstract class GCreateFavoriteProductInput
    implements
        Built<GCreateFavoriteProductInput, GCreateFavoriteProductInputBuilder> {
  GCreateFavoriteProductInput._();

  factory GCreateFavoriteProductInput(
          [Function(GCreateFavoriteProductInputBuilder b) updates]) =
      _$GCreateFavoriteProductInput;

  @nullable
  String get id;
  String get userId;
  String get unitId;
  @nullable
  String get favoriteProductProductId;
  static Serializer<GCreateFavoriteProductInput> get serializer =>
      _$gCreateFavoriteProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GCreateFavoriteProductInput.serializer, this);
  static GCreateFavoriteProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GCreateFavoriteProductInput.serializer, json);
}

abstract class GUpdateFavoriteProductInput
    implements
        Built<GUpdateFavoriteProductInput, GUpdateFavoriteProductInputBuilder> {
  GUpdateFavoriteProductInput._();

  factory GUpdateFavoriteProductInput(
          [Function(GUpdateFavoriteProductInputBuilder b) updates]) =
      _$GUpdateFavoriteProductInput;

  String get id;
  @nullable
  String get userId;
  @nullable
  String get unitId;
  @nullable
  String get favoriteProductProductId;
  static Serializer<GUpdateFavoriteProductInput> get serializer =>
      _$gUpdateFavoriteProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GUpdateFavoriteProductInput.serializer, this);
  static GUpdateFavoriteProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GUpdateFavoriteProductInput.serializer, json);
}

abstract class GDeleteFavoriteProductInput
    implements
        Built<GDeleteFavoriteProductInput, GDeleteFavoriteProductInputBuilder> {
  GDeleteFavoriteProductInput._();

  factory GDeleteFavoriteProductInput(
          [Function(GDeleteFavoriteProductInputBuilder b) updates]) =
      _$GDeleteFavoriteProductInput;

  @nullable
  String get id;
  static Serializer<GDeleteFavoriteProductInput> get serializer =>
      _$gDeleteFavoriteProductInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GDeleteFavoriteProductInput.serializer, this);
  static GDeleteFavoriteProductInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GDeleteFavoriteProductInput.serializer, json);
}

abstract class GModelFavoriteProductConditionInput
    implements
        Built<GModelFavoriteProductConditionInput,
            GModelFavoriteProductConditionInputBuilder> {
  GModelFavoriteProductConditionInput._();

  factory GModelFavoriteProductConditionInput(
          [Function(GModelFavoriteProductConditionInputBuilder b) updates]) =
      _$GModelFavoriteProductConditionInput;

  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  BuiltList<GModelFavoriteProductConditionInput> get and;
  @nullable
  BuiltList<GModelFavoriteProductConditionInput> get or;
  @nullable
  GModelFavoriteProductConditionInput get not;
  static Serializer<GModelFavoriteProductConditionInput> get serializer =>
      _$gModelFavoriteProductConditionInputSerializer;
  Map<String, dynamic> toJson() => _i1.serializers
      .serializeWith(GModelFavoriteProductConditionInput.serializer, this);
  static GModelFavoriteProductConditionInput fromJson(
          Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(
          GModelFavoriteProductConditionInput.serializer, json);
}

abstract class GOrderItemInput
    implements Built<GOrderItemInput, GOrderItemInputBuilder> {
  GOrderItemInput._();

  factory GOrderItemInput([Function(GOrderItemInputBuilder b) updates]) =
      _$GOrderItemInput;

  String get productId;
  String get variantId;
  @nullable
  GLocalizedItemInput get productName;
  @nullable
  GPriceShownInput get priceShown;
  @nullable
  int get quantity;
  @nullable
  BuiltList<GStatusLogInput> get statusLog;
  @nullable
  GLocalizedItemInput get variantName;
  @nullable
  int get created;
  @nullable
  bool get takeAway;
  static Serializer<GOrderItemInput> get serializer =>
      _$gOrderItemInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GOrderItemInput.serializer, this);
  static GOrderItemInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GOrderItemInput.serializer, json);
}

abstract class GPriceShownInput
    implements Built<GPriceShownInput, GPriceShownInputBuilder> {
  GPriceShownInput._();

  factory GPriceShownInput([Function(GPriceShownInputBuilder b) updates]) =
      _$GPriceShownInput;

  @nullable
  String get currency;
  @nullable
  double get pricePerUnit;
  @nullable
  double get priceSum;
  @nullable
  int get tax;
  @nullable
  double get taxSum;
  static Serializer<GPriceShownInput> get serializer =>
      _$gPriceShownInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GPriceShownInput.serializer, this);
  static GPriceShownInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GPriceShownInput.serializer, json);
}

abstract class GStatusLogInput
    implements Built<GStatusLogInput, GStatusLogInputBuilder> {
  GStatusLogInput._();

  factory GStatusLogInput([Function(GStatusLogInputBuilder b) updates]) =
      _$GStatusLogInput;

  String get userId;
  @nullable
  String get status;
  @nullable
  int get ts;
  static Serializer<GStatusLogInput> get serializer =>
      _$gStatusLogInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GStatusLogInput.serializer, this);
  static GStatusLogInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GStatusLogInput.serializer, json);
}

abstract class GModelOrderStatusInput
    implements Built<GModelOrderStatusInput, GModelOrderStatusInputBuilder> {
  GModelOrderStatusInput._();

  factory GModelOrderStatusInput(
          [Function(GModelOrderStatusInputBuilder b) updates]) =
      _$GModelOrderStatusInput;

  @nullable
  GOrderStatus get eq;
  @nullable
  GOrderStatus get ne;
  static Serializer<GModelOrderStatusInput> get serializer =>
      _$gModelOrderStatusInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelOrderStatusInput.serializer, this);
  static GModelOrderStatusInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelOrderStatusInput.serializer, json);
}

abstract class GModelOrderFilterInput
    implements Built<GModelOrderFilterInput, GModelOrderFilterInputBuilder> {
  GModelOrderFilterInput._();

  factory GModelOrderFilterInput(
          [Function(GModelOrderFilterInputBuilder b) updates]) =
      _$GModelOrderFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelStringInput get staffId;
  @nullable
  GModelBooleanInput get takeAway;
  @nullable
  GModelIntInput get paymentIntention;
  @nullable
  GModelIntInput get created;
  @nullable
  GModelOrderStatusInput get status;
  @nullable
  BuiltList<GModelOrderFilterInput> get and;
  @nullable
  BuiltList<GModelOrderFilterInput> get or;
  @nullable
  GModelOrderFilterInput get not;
  static Serializer<GModelOrderFilterInput> get serializer =>
      _$gModelOrderFilterInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelOrderFilterInput.serializer, this);
  static GModelOrderFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelOrderFilterInput.serializer, json);
}

abstract class GCreateOrderInput
    implements Built<GCreateOrderInput, GCreateOrderInputBuilder> {
  GCreateOrderInput._();

  factory GCreateOrderInput([Function(GCreateOrderInputBuilder b) updates]) =
      _$GCreateOrderInput;

  @nullable
  String get id;
  String get userId;
  String get unitId;
  @nullable
  BuiltList<GOrderItemInput> get items;
  @nullable
  GPaymentModeInput get paymentMethod;
  @nullable
  String get staffId;
  @nullable
  GPriceShownInput get sumPriceShown;
  @nullable
  bool get takeAway;
  @nullable
  GPlaceInput get place;
  @nullable
  int get paymentIntention;
  @nullable
  BuiltList<GStatusLogInput> get statusLog;
  @nullable
  int get created;
  @nullable
  GOrderStatus get status;
  static Serializer<GCreateOrderInput> get serializer =>
      _$gCreateOrderInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GCreateOrderInput.serializer, this);
  static GCreateOrderInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GCreateOrderInput.serializer, json);
}

abstract class GUpdateOrderInput
    implements Built<GUpdateOrderInput, GUpdateOrderInputBuilder> {
  GUpdateOrderInput._();

  factory GUpdateOrderInput([Function(GUpdateOrderInputBuilder b) updates]) =
      _$GUpdateOrderInput;

  String get id;
  @nullable
  String get userId;
  @nullable
  String get unitId;
  @nullable
  BuiltList<GOrderItemInput> get items;
  @nullable
  GPaymentModeInput get paymentMethod;
  @nullable
  String get staffId;
  @nullable
  GPriceShownInput get sumPriceShown;
  @nullable
  bool get takeAway;
  @nullable
  GPlaceInput get place;
  @nullable
  int get paymentIntention;
  @nullable
  BuiltList<GStatusLogInput> get statusLog;
  @nullable
  int get created;
  @nullable
  GOrderStatus get status;
  static Serializer<GUpdateOrderInput> get serializer =>
      _$gUpdateOrderInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GUpdateOrderInput.serializer, this);
  static GUpdateOrderInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GUpdateOrderInput.serializer, json);
}

abstract class GDeleteOrderInput
    implements Built<GDeleteOrderInput, GDeleteOrderInputBuilder> {
  GDeleteOrderInput._();

  factory GDeleteOrderInput([Function(GDeleteOrderInputBuilder b) updates]) =
      _$GDeleteOrderInput;

  @nullable
  String get id;
  static Serializer<GDeleteOrderInput> get serializer =>
      _$gDeleteOrderInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GDeleteOrderInput.serializer, this);
  static GDeleteOrderInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GDeleteOrderInput.serializer, json);
}

abstract class GModelOrderConditionInput
    implements
        Built<GModelOrderConditionInput, GModelOrderConditionInputBuilder> {
  GModelOrderConditionInput._();

  factory GModelOrderConditionInput(
          [Function(GModelOrderConditionInputBuilder b) updates]) =
      _$GModelOrderConditionInput;

  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelStringInput get staffId;
  @nullable
  GModelBooleanInput get takeAway;
  @nullable
  GModelIntInput get paymentIntention;
  @nullable
  GModelIntInput get created;
  @nullable
  GModelOrderStatusInput get status;
  @nullable
  BuiltList<GModelOrderConditionInput> get and;
  @nullable
  BuiltList<GModelOrderConditionInput> get or;
  @nullable
  GModelOrderConditionInput get not;
  static Serializer<GModelOrderConditionInput> get serializer =>
      _$gModelOrderConditionInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelOrderConditionInput.serializer, this);
  static GModelOrderConditionInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelOrderConditionInput.serializer, json);
}

abstract class GCartItemInput
    implements Built<GCartItemInput, GCartItemInputBuilder> {
  GCartItemInput._();

  factory GCartItemInput([Function(GCartItemInputBuilder b) updates]) =
      _$GCartItemInput;

  GProductVariantInput get variant;
  int get quantity;
  static Serializer<GCartItemInput> get serializer =>
      _$gCartItemInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GCartItemInput.serializer, this);
  static GCartItemInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GCartItemInput.serializer, json);
}

abstract class GModelCartFilterInput
    implements Built<GModelCartFilterInput, GModelCartFilterInputBuilder> {
  GModelCartFilterInput._();

  factory GModelCartFilterInput(
          [Function(GModelCartFilterInputBuilder b) updates]) =
      _$GModelCartFilterInput;

  @nullable
  GModelIDInput get id;
  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelBooleanInput get takeAway;
  @nullable
  GModelIntInput get created;
  @nullable
  BuiltList<GModelCartFilterInput> get and;
  @nullable
  BuiltList<GModelCartFilterInput> get or;
  @nullable
  GModelCartFilterInput get not;
  static Serializer<GModelCartFilterInput> get serializer =>
      _$gModelCartFilterInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelCartFilterInput.serializer, this);
  static GModelCartFilterInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GModelCartFilterInput.serializer, json);
}

abstract class GCreateCartInput
    implements Built<GCreateCartInput, GCreateCartInputBuilder> {
  GCreateCartInput._();

  factory GCreateCartInput([Function(GCreateCartInputBuilder b) updates]) =
      _$GCreateCartInput;

  @nullable
  String get id;
  String get userId;
  String get unitId;
  @nullable
  bool get takeAway;
  @nullable
  GPlaceInput get place;
  @nullable
  GPaymentModeInput get paymentMethod;
  @nullable
  int get created;
  @nullable
  BuiltList<GCartItemInput> get items;
  static Serializer<GCreateCartInput> get serializer =>
      _$gCreateCartInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GCreateCartInput.serializer, this);
  static GCreateCartInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GCreateCartInput.serializer, json);
}

abstract class GUpdateCartInput
    implements Built<GUpdateCartInput, GUpdateCartInputBuilder> {
  GUpdateCartInput._();

  factory GUpdateCartInput([Function(GUpdateCartInputBuilder b) updates]) =
      _$GUpdateCartInput;

  String get id;
  @nullable
  String get userId;
  @nullable
  String get unitId;
  @nullable
  bool get takeAway;
  @nullable
  GPlaceInput get place;
  @nullable
  GPaymentModeInput get paymentMethod;
  @nullable
  int get created;
  @nullable
  BuiltList<GCartItemInput> get items;
  static Serializer<GUpdateCartInput> get serializer =>
      _$gUpdateCartInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GUpdateCartInput.serializer, this);
  static GUpdateCartInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GUpdateCartInput.serializer, json);
}

abstract class GDeleteCartInput
    implements Built<GDeleteCartInput, GDeleteCartInputBuilder> {
  GDeleteCartInput._();

  factory GDeleteCartInput([Function(GDeleteCartInputBuilder b) updates]) =
      _$GDeleteCartInput;

  @nullable
  String get id;
  static Serializer<GDeleteCartInput> get serializer =>
      _$gDeleteCartInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GDeleteCartInput.serializer, this);
  static GDeleteCartInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers.deserializeWith(GDeleteCartInput.serializer, json);
}

abstract class GModelCartConditionInput
    implements
        Built<GModelCartConditionInput, GModelCartConditionInputBuilder> {
  GModelCartConditionInput._();

  factory GModelCartConditionInput(
          [Function(GModelCartConditionInputBuilder b) updates]) =
      _$GModelCartConditionInput;

  @nullable
  GModelIDInput get userId;
  @nullable
  GModelIDInput get unitId;
  @nullable
  GModelBooleanInput get takeAway;
  @nullable
  GModelIntInput get created;
  @nullable
  BuiltList<GModelCartConditionInput> get and;
  @nullable
  BuiltList<GModelCartConditionInput> get or;
  @nullable
  GModelCartConditionInput get not;
  static Serializer<GModelCartConditionInput> get serializer =>
      _$gModelCartConditionInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelCartConditionInput.serializer, this);
  static GModelCartConditionInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelCartConditionInput.serializer, json);
}

abstract class GModelIDKeyConditionInput
    implements
        Built<GModelIDKeyConditionInput, GModelIDKeyConditionInputBuilder> {
  GModelIDKeyConditionInput._();

  factory GModelIDKeyConditionInput(
          [Function(GModelIDKeyConditionInputBuilder b) updates]) =
      _$GModelIDKeyConditionInput;

  @nullable
  String get eq;
  @nullable
  String get le;
  @nullable
  String get lt;
  @nullable
  String get ge;
  @nullable
  String get gt;
  @nullable
  BuiltList<String> get between;
  @nullable
  String get beginsWith;
  static Serializer<GModelIDKeyConditionInput> get serializer =>
      _$gModelIDKeyConditionInputSerializer;
  Map<String, dynamic> toJson() =>
      _i1.serializers.serializeWith(GModelIDKeyConditionInput.serializer, this);
  static GModelIDKeyConditionInput fromJson(Map<String, dynamic> json) =>
      _i1.serializers
          .deserializeWith(GModelIDKeyConditionInput.serializer, json);
}
