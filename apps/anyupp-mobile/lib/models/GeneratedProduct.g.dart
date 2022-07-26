// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'GeneratedProduct.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $GeneratedProduct {
  const $GeneratedProduct();

  String get id;
  String get unitId;
  String get productCategoryId;
  LocalizedItem get name;
  LocalizedItem? get description;
  ProductType get productType;
  int get tax;
  int get position;
  String? get image;
  List<ProductVariant> get variants;
  List<Allergen>? get allergens;
  List<GeneratedProductConfigSet>? get configSets;
  List<ServingMode> get supportedServingModes;
  bool get soldOut;

  GeneratedProduct copyWith({
    String? id,
    String? unitId,
    String? productCategoryId,
    LocalizedItem? name,
    LocalizedItem? description,
    ProductType? productType,
    int? tax,
    int? position,
    String? image,
    List<ProductVariant>? variants,
    List<Allergen>? allergens,
    List<GeneratedProductConfigSet>? configSets,
    List<ServingMode>? supportedServingModes,
    bool? soldOut,
  }) =>
      GeneratedProduct(
        id: id ?? this.id,
        unitId: unitId ?? this.unitId,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        name: name ?? this.name,
        description: description ?? this.description,
        productType: productType ?? this.productType,
        tax: tax ?? this.tax,
        position: position ?? this.position,
        image: image ?? this.image,
        variants: variants ?? this.variants,
        allergens: allergens ?? this.allergens,
        configSets: configSets ?? this.configSets,
        supportedServingModes:
            supportedServingModes ?? this.supportedServingModes,
        soldOut: soldOut ?? this.soldOut,
      );

  GeneratedProduct copyUsing(
      void Function(GeneratedProduct$Change change) mutator) {
    final change = GeneratedProduct$Change._(
      this.id,
      this.unitId,
      this.productCategoryId,
      this.name,
      this.description,
      this.productType,
      this.tax,
      this.position,
      this.image,
      this.variants,
      this.allergens,
      this.configSets,
      this.supportedServingModes,
      this.soldOut,
    );
    mutator(change);
    return GeneratedProduct(
      id: change.id,
      unitId: change.unitId,
      productCategoryId: change.productCategoryId,
      name: change.name,
      description: change.description,
      productType: change.productType,
      tax: change.tax,
      position: change.position,
      image: change.image,
      variants: change.variants,
      allergens: change.allergens,
      configSets: change.configSets,
      supportedServingModes: change.supportedServingModes,
      soldOut: change.soldOut,
    );
  }

  @override
  String toString() =>
      "GeneratedProduct(id: $id, unitId: $unitId, productCategoryId: $productCategoryId, name: $name, description: $description, productType: $productType, tax: $tax, position: $position, image: $image, variants: $variants, allergens: $allergens, configSets: $configSets, supportedServingModes: $supportedServingModes, soldOut: $soldOut)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is GeneratedProduct &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      unitId == other.unitId &&
      productCategoryId == other.productCategoryId &&
      name == other.name &&
      description == other.description &&
      productType == other.productType &&
      tax == other.tax &&
      position == other.position &&
      image == other.image &&
      variants == other.variants &&
      allergens == other.allergens &&
      configSets == other.configSets &&
      supportedServingModes == other.supportedServingModes &&
      soldOut == other.soldOut;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + unitId.hashCode;
    result = 37 * result + productCategoryId.hashCode;
    result = 37 * result + name.hashCode;
    result = 37 * result + description.hashCode;
    result = 37 * result + productType.hashCode;
    result = 37 * result + tax.hashCode;
    result = 37 * result + position.hashCode;
    result = 37 * result + image.hashCode;
    result = 37 * result + variants.hashCode;
    result = 37 * result + allergens.hashCode;
    result = 37 * result + configSets.hashCode;
    result = 37 * result + supportedServingModes.hashCode;
    result = 37 * result + soldOut.hashCode;
    return result;
  }
}

class GeneratedProduct$Change {
  GeneratedProduct$Change._(
    this.id,
    this.unitId,
    this.productCategoryId,
    this.name,
    this.description,
    this.productType,
    this.tax,
    this.position,
    this.image,
    this.variants,
    this.allergens,
    this.configSets,
    this.supportedServingModes,
    this.soldOut,
  );

  String id;
  String unitId;
  String productCategoryId;
  LocalizedItem name;
  LocalizedItem? description;
  ProductType productType;
  int tax;
  int position;
  String? image;
  List<ProductVariant> variants;
  List<Allergen>? allergens;
  List<GeneratedProductConfigSet>? configSets;
  List<ServingMode> supportedServingModes;
  bool soldOut;
}

// ignore: avoid_classes_with_only_static_members
class GeneratedProduct$ {
  static final id = Lens<GeneratedProduct, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final unitId = Lens<GeneratedProduct, String>(
    (unitIdContainer) => unitIdContainer.unitId,
    (unitIdContainer, unitId) => unitIdContainer.copyWith(unitId: unitId),
  );

  static final productCategoryId = Lens<GeneratedProduct, String>(
    (productCategoryIdContainer) =>
        productCategoryIdContainer.productCategoryId,
    (productCategoryIdContainer, productCategoryId) =>
        productCategoryIdContainer.copyWith(
            productCategoryId: productCategoryId),
  );

  static final name = Lens<GeneratedProduct, LocalizedItem>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final description = Lens<GeneratedProduct, LocalizedItem?>(
    (descriptionContainer) => descriptionContainer.description,
    (descriptionContainer, description) =>
        descriptionContainer.copyWith(description: description),
  );

  static final productType = Lens<GeneratedProduct, ProductType>(
    (productTypeContainer) => productTypeContainer.productType,
    (productTypeContainer, productType) =>
        productTypeContainer.copyWith(productType: productType),
  );

  static final tax = Lens<GeneratedProduct, int>(
    (taxContainer) => taxContainer.tax,
    (taxContainer, tax) => taxContainer.copyWith(tax: tax),
  );

  static final position = Lens<GeneratedProduct, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );

  static final image = Lens<GeneratedProduct, String?>(
    (imageContainer) => imageContainer.image,
    (imageContainer, image) => imageContainer.copyWith(image: image),
  );

  static final variants = Lens<GeneratedProduct, List<ProductVariant>>(
    (variantsContainer) => variantsContainer.variants,
    (variantsContainer, variants) =>
        variantsContainer.copyWith(variants: variants),
  );

  static final allergens = Lens<GeneratedProduct, List<Allergen>?>(
    (allergensContainer) => allergensContainer.allergens,
    (allergensContainer, allergens) =>
        allergensContainer.copyWith(allergens: allergens),
  );

  static final configSets =
      Lens<GeneratedProduct, List<GeneratedProductConfigSet>?>(
    (configSetsContainer) => configSetsContainer.configSets,
    (configSetsContainer, configSets) =>
        configSetsContainer.copyWith(configSets: configSets),
  );

  static final supportedServingModes =
      Lens<GeneratedProduct, List<ServingMode>>(
    (supportedServingModesContainer) =>
        supportedServingModesContainer.supportedServingModes,
    (supportedServingModesContainer, supportedServingModes) =>
        supportedServingModesContainer.copyWith(
            supportedServingModes: supportedServingModes),
  );

  static final soldOut = Lens<GeneratedProduct, bool>(
    (soldOutContainer) => soldOutContainer.soldOut,
    (soldOutContainer, soldOut) => soldOutContainer.copyWith(soldOut: soldOut),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeneratedProduct _$GeneratedProductFromJson(Map<String, dynamic> json) =>
    GeneratedProduct(
      id: json['id'] as String,
      unitId: json['unitId'] as String,
      productCategoryId: json['productCategoryId'] as String,
      name: json['name'],
      description: json['description'],
      productType: $enumDecode(_$ProductTypeEnumMap, json['productType']),
      tax: json['tax'] as int,
      position: json['position'] as int,
      image: json['image'] as String?,
      variants: json['variants'] as List<dynamic>,
      allergens: (json['allergens'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$AllergenEnumMap, e))
          .toList(),
      configSets: json['configSets'] as List<dynamic>?,
      supportedServingModes: (json['supportedServingModes'] as List<dynamic>)
          .map((e) => $enumDecode(_$ServingModeEnumMap, e))
          .toList(),
      soldOut: json['soldOut'] as bool? ?? false,
    );

Map<String, dynamic> _$GeneratedProductToJson(GeneratedProduct instance) =>
    <String, dynamic>{
      'id': instance.id,
      'unitId': instance.unitId,
      'productCategoryId': instance.productCategoryId,
      'name': instance.name,
      'description': instance.description,
      'productType': _$ProductTypeEnumMap[instance.productType]!,
      'tax': instance.tax,
      'position': instance.position,
      'image': instance.image,
      'variants': instance.variants,
      'allergens':
          instance.allergens?.map((e) => _$AllergenEnumMap[e]!).toList(),
      'configSets': instance.configSets,
      'supportedServingModes': instance.supportedServingModes
          .map((e) => _$ServingModeEnumMap[e]!)
          .toList(),
      'soldOut': instance.soldOut,
    };

const _$ProductTypeEnumMap = {
  ProductType.drink: 'drink',
  ProductType.food: 'food',
  ProductType.dish: 'dish',
  ProductType.other: 'other',
  ProductType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$AllergenEnumMap = {
  Allergen.celery: 'celery',
  Allergen.crustaceans: 'crustaceans',
  Allergen.egg: 'egg',
  Allergen.fish: 'fish',
  Allergen.gluten: 'gluten',
  Allergen.lupin: 'lupin',
  Allergen.milk: 'milk',
  Allergen.molluscs: 'molluscs',
  Allergen.mustard: 'mustard',
  Allergen.peanut: 'peanut',
  Allergen.sesame: 'sesame',
  Allergen.soya: 'soya',
  Allergen.sulphites: 'sulphites',
  Allergen.treenuts: 'treenuts',
  Allergen.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$ServingModeEnumMap = {
  ServingMode.inPlace: 'inPlace',
  ServingMode.takeAway: 'takeAway',
  ServingMode.artemisUnknown: 'ARTEMIS_UNKNOWN',
};
