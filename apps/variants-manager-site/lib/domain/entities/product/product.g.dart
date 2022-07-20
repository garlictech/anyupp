// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Product {
  const $Product();

  String get id;
  List<Variant> get variants;
  String get name;

  Product copyWith({
    String? id,
    List<Variant>? variants,
    String? name,
  }) =>
      Product(
        id: id ?? this.id,
        variants: variants ?? this.variants,
        name: name ?? this.name,
      );

  Product copyUsing(void Function(Product$Change change) mutator) {
    final change = Product$Change._(
      this.id,
      this.variants,
      this.name,
    );
    mutator(change);
    return Product(
      id: change.id,
      variants: change.variants,
      name: change.name,
    );
  }

  @override
  String toString() => "Product(id: $id, variants: $variants, name: $name)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Product &&
      other.runtimeType == runtimeType &&
      id == other.id &&
      variants == other.variants &&
      name == other.name;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + id.hashCode;
    result = 37 * result + variants.hashCode;
    result = 37 * result + name.hashCode;
    return result;
  }
}

class Product$Change {
  Product$Change._(
    this.id,
    this.variants,
    this.name,
  );

  String id;
  List<Variant> variants;
  String name;
}

// ignore: avoid_classes_with_only_static_members
class Product$ {
  static final id = Lens<Product, String>(
    (idContainer) => idContainer.id,
    (idContainer, id) => idContainer.copyWith(id: id),
  );

  static final variants = Lens<Product, List<Variant>>(
    (variantsContainer) => variantsContainer.variants,
    (variantsContainer, variants) =>
        variantsContainer.copyWith(variants: variants),
  );

  static final name = Lens<Product, String>(
    (nameContainer) => nameContainer.name,
    (nameContainer, name) => nameContainer.copyWith(name: name),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
      id: json['id'] as String,
      variants: (json['variants'] as List<dynamic>)
          .map((e) => Variant.fromJson(e as Map<String, dynamic>))
          .toList(),
      name: json['name'] as String,
    );

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
      'id': instance.id,
      'variants': instance.variants,
      'name': instance.name,
    };
