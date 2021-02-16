part of 'product_categories_bloc.dart';

@immutable
abstract class ProductCategoriesState {
  const ProductCategoriesState();
}

class ProductCategoriesLoading extends ProductCategoriesState {}

class ProductCategoriesLoaded extends ProductCategoriesState {
  final List<ProductCategory> productCategories;
  const ProductCategoriesLoaded(this.productCategories);
}

class ProductCategoriesLoadFailed extends ProductCategoriesState {}
