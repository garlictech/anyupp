part of 'product_categories_bloc.dart';

abstract class ProductCategoriesEvent {
  const ProductCategoriesEvent();
}

class LoadProductCategories extends ProductCategoriesEvent {
  final String unitId;
  final String chainId;
  const LoadProductCategories(this.chainId, this.unitId);
}

class ProductCategoriesUpdated extends ProductCategoriesEvent {
  final List<ProductCategory>? productCategories;
  const ProductCategoriesUpdated(this.productCategories);
}
