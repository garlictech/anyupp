// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'GeneratedProductCategory.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $GeneratedProductCategory {
  const $GeneratedProductCategory();

  String get id;
  String get productCategoryId;
  int? get productNum;
  String get ownerEntity;
  ProductCategory get productCategory;
  String? get updatedAt;
  String? get createdAt;

  GeneratedProductCategory copyWith({
    String? id,
    String? productCategoryId,
    int? productNum,
    String? ownerEntity,
    ProductCategory? productCategory,
    String? updatedAt,
    String? createdAt,
  }) =>
      GeneratedProductCategory(
        id: id ?? this.id,
        productCategoryId: productCategoryId ?? this.productCategoryId,
        productNum: productNum ?? this.productNum,
        ownerEntity: ownerEntity ?? this.ownerEntity,
        productCategory: productCategory ?? this.productCategory,
        updatedAt: updatedAt ?? this.updatedAt,
        createdAt: createdAt ?? this.createdAt,
      );

  GeneratedProductCategory copyUsing(
      void Function(GeneratedProductCategory$Change change) mutator) {
    final change = GeneratedProductCategory$Change._(
      this.id,
      this.productCategoryId,
      this.productNum,
      this.ownerEntity,
      this.productCategory,
      this.updatedAt,
      this.createdAt,
    );
    mutator(change);
    return GeneratedProductCategory(
      id: change.id,
      productCategoryId: change.productCategoryId,
      productNum: change.productNum,
      ownerEntity: change.ownerEntity,
      productCategory: change.productCategory,
      updatedAt: change.updatedAt,
      createdAt: change.createdAt,
    );
  }

  @override
  String toString() =>
      "GeneratedProductCategory(id: $id, productCategoryId: $productCategoryId, productNum: $productNum, ownerEntity: $ownerEntity, productCategory: $productCategory, updatedAt: $updatedAt, createdAt: $createdAt)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is GeneratedProductCategory &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      productCategoryId == other.productCategoryId &&
      productNum == other.productNum &&
      ownerEntity == other.ownerEntity &&
      productCategory == other.productCategory &&
      updatedAt == other.updatedAt &&
      createdAt == other.createdAt;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + productCategoryId.hashCode;
    result = 37 * result + productNum.hashCode;
    result = 37 * result + ownerEntity.hashCode;
    result = 37 * result + productCategory.hashCode;
    result = 37 * result + updatedAt.hashCode;
    result = 37 * result + createdAt.hashCode;
    return result;
  }
}

class GeneratedProductCategory$Change {
  GeneratedProductCategory$Change._(
    this.id,
    this.productCategoryId,
    this.productNum,
    this.ownerEntity,
    this.productCategory,
    this.updatedAt,
    this.createdAt,
  );

  String id;
  String productCategoryId;
  int? productNum;
  String ownerEntity;
  ProductCategory productCategory;
  String? updatedAt;
  String? createdAt;
}

// ignore: avoid_classes_with_only_static_members
class GeneratedProductCategory$ {
  static final id = Lens<GeneratedProductCategory, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final productCategoryId = Lens<GeneratedProductCategory, String>(
    (productCategoryIdContainer) =>
        productCategoryIdContainer.productCategoryId,
    (productCategoryIdContainer, productCategoryId) =>
        productCategoryIdContainer.copyWith(
            productCategoryId: productCategoryId),
  );

  static final productNum = Lens<GeneratedProductCategory, int?>(
    (productNumContainer) => productNumContainer.productNum,
    (productNumContainer, productNum) =>
        productNumContainer.copyWith(productNum: productNum),
  );

  static final ownerEntity = Lens<GeneratedProductCategory, String>(
    (ownerEntityContainer) => ownerEntityContainer.ownerEntity,
    (ownerEntityContainer, ownerEntity) =>
        ownerEntityContainer.copyWith(ownerEntity: ownerEntity),
  );

  static final productCategory =
      Lens<GeneratedProductCategory, ProductCategory>(
    (productCategoryContainer) => productCategoryContainer.productCategory,
    (productCategoryContainer, productCategory) =>
        productCategoryContainer.copyWith(productCategory: productCategory),
  );

  static final updatedAt = Lens<GeneratedProductCategory, String?>(
    (updatedAtContainer) => updatedAtContainer.updatedAt,
    (updatedAtContainer, updatedAt) =>
        updatedAtContainer.copyWith(updatedAt: updatedAt),
  );

  static final createdAt = Lens<GeneratedProductCategory, String?>(
    (createdAtContainer) => createdAtContainer.createdAt,
    (createdAtContainer, createdAt) =>
        createdAtContainer.copyWith(createdAt: createdAt),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeneratedProductCategory _$GeneratedProductCategoryFromJson(
        Map<String, dynamic> json) =>
    GeneratedProductCategory(
      id: json['id'] as String,
      productCategoryId: json['productCategoryId'] as String,
      productNum: json['productNum'] as int?,
      ownerEntity: json['ownerEntity'] as String,
      productCategory: json['productCategory'],
      updatedAt: json['updatedAt'] as String?,
      createdAt: json['createdAt'] as String?,
    );

Map<String, dynamic> _$GeneratedProductCategoryToJson(
    GeneratedProductCategory instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'productCategoryId': instance.productCategoryId,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('productNum', instance.productNum);
  val['ownerEntity'] = instance.ownerEntity;
  writeNotNull('productCategory', instance.productCategory);
  writeNotNull('updatedAt', instance.updatedAt);
  writeNotNull('createdAt', instance.createdAt);
  return val;
}
