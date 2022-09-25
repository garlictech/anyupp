// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ProductConfigSet.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductConfigSet {
  const $ProductConfigSet();

  String get productSetId;
  int get position;
  List<ProductConfigComponent> get items;

  ProductConfigSet copyWith({
    String? productSetId,
    int? position,
    List<ProductConfigComponent>? items,
  }) =>
      ProductConfigSet(
        productSetId: productSetId ?? this.productSetId,
        position: position ?? this.position,
        items: items ?? this.items,
      );

  ProductConfigSet copyUsing(
      void Function(ProductConfigSet$Change change) mutator) {
    final change = ProductConfigSet$Change._(
      this.productSetId,
      this.position,
      this.items,
    );
    mutator(change);
    return ProductConfigSet(
      productSetId: change.productSetId,
      position: change.position,
      items: change.items,
    );
  }

  @override
  String toString() =>
      "ProductConfigSet(productSetId: $productSetId, position: $position, items: $items)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductConfigSet &&
      other.runtimeType == runtimeType &&
      productSetId == other.productSetId &&
      position == other.position &&
      items == other.items;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + productSetId.hashCode;
    result = 37 * result + position.hashCode;
    result = 37 * result + items.hashCode;
    return result;
  }
}

class ProductConfigSet$Change {
  ProductConfigSet$Change._(
    this.productSetId,
    this.position,
    this.items,
  );

  String productSetId;
  int position;
  List<ProductConfigComponent> items;
}

// ignore: avoid_classes_with_only_static_members
class ProductConfigSet$ {
  static final productSetId = Lens<ProductConfigSet, String>(
    (productSetIdContainer) => productSetIdContainer.productSetId,
    (productSetIdContainer, productSetId) =>
        productSetIdContainer.copyWith(productSetId: productSetId),
  );

  static final position = Lens<ProductConfigSet, int>(
    (positionContainer) => positionContainer.position,
    (positionContainer, position) =>
        positionContainer.copyWith(position: position),
  );

  static final items = Lens<ProductConfigSet, List<ProductConfigComponent>>(
    (itemsContainer) => itemsContainer.items,
    (itemsContainer, items) => itemsContainer.copyWith(items: items),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductConfigSet _$ProductConfigSetFromJson(Map<String, dynamic> json) =>
    ProductConfigSet(
      productSetId: json['productSetId'] as String,
      position: json['position'] as int,
      items: (json['items'] as List<dynamic>)
          .map(
              (e) => ProductConfigComponent.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ProductConfigSetToJson(ProductConfigSet instance) =>
    <String, dynamic>{
      'productSetId': instance.productSetId,
      'position': instance.position,
      'items': instance.items.map((e) => e.toJson()).toList(),
    };
