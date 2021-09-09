part of 'product_categories_bloc.dart';

abstract class ProductCategoriesEvent {
  const ProductCategoriesEvent();
}

class LoadProductCategories extends ProductCategoriesEvent {
  final String unitId;
  const LoadProductCategories(this.unitId);
}

class ProductCategoriesUpdated extends ProductCategoriesEvent {
  final PageResponse<ProductCategory>? productCategories;
  const ProductCategoriesUpdated(this.productCategories);
}
