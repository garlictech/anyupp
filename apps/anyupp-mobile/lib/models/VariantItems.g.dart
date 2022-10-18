// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'VariantItems.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $VariantItems {
  const $VariantItems();

  List<ProductVariant> get items;

  VariantItems copyWith({
    List<ProductVariant>? items,
  }) =>
      VariantItems(
        items: items ?? this.items,
      );

  VariantItems copyUsing(void Function(VariantItems$Change change) mutator) {
    final change = VariantItems$Change._(
      this.items,
    );
    mutator(change);
    return VariantItems(
      items: change.items,
    );
  }

  @override
  String toString() => "VariantItems(items: $items)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is VariantItems &&
      other.runtimeType == runtimeType &&
      items == other.items;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    return items.hashCode;
  }
}

class VariantItems$Change {
  VariantItems$Change._(
    this.items,
  );

  List<ProductVariant> items;
}

// ignore: avoid_classes_with_only_static_members
class VariantItems$ {
  static final items = Lens<VariantItems, List<ProductVariant>>(
    (itemsContainer) => itemsContainer.items,
    (itemsContainer, items) => itemsContainer.copyWith(items: items),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VariantItems _$VariantItemsFromJson(Map<String, dynamic> json) => VariantItems(
      items: (json['items'] as List<dynamic>)
          .map((e) => ProductVariant.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$VariantItemsToJson(VariantItems instance) =>
    <String, dynamic>{
      'items': instance.items.map((e) => e.toJson()).toList(),
    };
