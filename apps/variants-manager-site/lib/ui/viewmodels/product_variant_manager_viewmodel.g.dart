// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_variant_manager_viewmodel.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $ProductVariantManagerViewModel {
  const $ProductVariantManagerViewModel();

  bool get working;

  ProductVariantManagerViewModel copyWith({
    bool? working,
  }) =>
      ProductVariantManagerViewModel(
        working: working ?? this.working,
      );

  ProductVariantManagerViewModel copyUsing(
      void Function(ProductVariantManagerViewModel$Change change) mutator) {
    final change = ProductVariantManagerViewModel$Change._(
      this.working,
    );
    mutator(change);
    return ProductVariantManagerViewModel(
      working: change.working,
    );
  }

  @override
  String toString() => "ProductVariantManagerViewModel(working: $working)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is ProductVariantManagerViewModel &&
      other.runtimeType == runtimeType &&
      working == other.working;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    return working.hashCode;
  }
}

class ProductVariantManagerViewModel$Change {
  ProductVariantManagerViewModel$Change._(
    this.working,
  );

  bool working;
}

// ignore: avoid_classes_with_only_static_members
class ProductVariantManagerViewModel$ {
  static final working = Lens<ProductVariantManagerViewModel, bool>(
    (workingContainer) => workingContainer.working,
    (workingContainer, working) => workingContainer.copyWith(working: working),
  );
}
