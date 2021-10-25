part of 'product_categories_bloc.dart';

abstract class ProductCategoriesState extends Equatable {
  const ProductCategoriesState();
  @override
  List<Object?> get props => [];
}

class NoProductCategoriesLoaded extends ProductCategoriesState {}

class ProductCategoriesLoading extends ProductCategoriesState {}

class ProductCategoriesLoaded extends ProductCategoriesState {
  final List<ProductCategory>? productCategories;
  ProductCategoriesLoaded(this.productCategories);

  @override
  List<Object?> get props => [productCategories];
}

class ProductCategoriesLoadFailed extends ProductCategoriesState {}
