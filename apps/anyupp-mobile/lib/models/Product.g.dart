// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'Product.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Product {
  const $Product();

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
  List<ProductConfigSet>? get configSets;
  List<ServingMode> get supportedServingModes;
  bool get soldOut;

  Product copyWith({
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
    List<ProductConfigSet>? configSets,
    List<ServingMode>? supportedServingModes,
    bool? soldOut,
  }) =>
      Product(
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

  Product copyUsing(void Function(Product$Change change) mutator) {
    final change = Product$Change._(
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
    return Product(
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
      "Product(id: $id, unitId: $unitId, productCategoryId: $productCategoryId, name: $name, description: $description, productType: $productType, tax: $tax, position: $position, image: $image, variants: $variants, allergens: $allergens, configSets: $configSets, supportedServingModes: $supportedServingModes, soldOut: $soldOut)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Product &&
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

class Product$Change {
  Product$Change._(
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
  List<ProductConfigSet>? configSets;
  List<ServingMode> supportedServingModes;
  bool soldOut;
}

// ignore: avoid_classes_with_only_static_members
class Product$ {
  static final id = Lens<Product, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final unitId = Lens<Product, String>(
    (unitIdContainer) => unitIdContainer.unitId,
    (unitIdContainer, unitId) => unitIdContainer.copyWith(unitId: unitId),
  );

  static final productCategoryId = Lens<Product, String>(
    (productCategoryIdContainer) =>
        productCategoryIdContainer.productCategoryId,
    (productCategoryIdContainer, productCategoryId) =>
        productCategoryIdContainer.copyWith(
            productCategoryId: productCategoryId),
  );

  static final name = Lens<Product, LocalizedItem>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );

  static final description = Lens<Product, LocalizedItem?>(
    (descriptionContainer) => descriptionContainer.description,
    (descriptionContainer, description) =>
        descriptionContainer.copyWith(description: description),
  );

  static final productType = Lens<Product, ProductType>(
    (productTypeContainer) => productTypeContainer.productType,
    (productTypeContainer, productType) =>
        productTypeContainer.copyWith(productType: productType),
  );

  static final tax = Lens<Product, int>(
    (taxContainer) => taxContainer.tax,
    (taxContainer, tax) => taxContainer.copyWith(tax: tax),
  );

  static final position = Lens<Product, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );

  static final image = Lens<Product, String?>(
    (imageContainer) => imageContainer.image,
    (imageContainer, image) => imageContainer.copyWith(image: image),
  );

  static final variants = Lens<Product, List<ProductVariant>>(
    (variantsContainer) => variantsContainer.variants,
    (variantsContainer, variants) =>
        variantsContainer.copyWith(variants: variants),
  );

  static final allergens = Lens<Product, List<Allergen>?>(
    (allergensContainer) => allergensContainer.allergens,
    (allergensContainer, allergens) =>
        allergensContainer.copyWith(allergens: allergens),
  );

  static final configSets = Lens<Product, List<ProductConfigSet>?>(
    (configSetsContainer) => configSetsContainer.configSets,
    (configSetsContainer, configSets) =>
        configSetsContainer.copyWith(configSets: configSets),
  );

  static final supportedServingModes = Lens<Product, List<ServingMode>>(
    (supportedServingModesContainer) =>
        supportedServingModesContainer.supportedServingModes,
    (supportedServingModesContainer, supportedServingModes) =>
        supportedServingModesContainer.copyWith(
            supportedServingModes: supportedServingModes),
  );

  static final soldOut = Lens<Product, bool>(
    (soldOutContainer) => soldOutContainer.soldOut,
    (soldOutContainer, soldOut) => soldOutContainer.copyWith(soldOut: soldOut),
  );
}
