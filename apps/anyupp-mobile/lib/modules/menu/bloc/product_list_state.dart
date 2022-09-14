part of 'product_list_bloc.dart';

abstract class ProductListState extends Equatable {
  const ProductListState();

  @override
  List<Object?> get props => [];
}

class NoProductListLoaded extends ProductListState {
  const NoProductListLoaded();
}

class ProductListLoading extends ProductListState {
  const ProductListLoading();
}

class ProductListLoaded extends ProductListState {
  final List<Product> products;
  final List<ProductCategory>? productCategories;
  final List<FavoriteProduct>? favorites;
  const ProductListLoaded(
      {required this.products, this.productCategories, this.favorites});

  @override
  List<Object?> get props => [products, productCategories, favorites];
}
