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
  final PageResponse<GeneratedProduct> products;
  const ProductListLoaded(this.products);

  @override
  List<Object?> get props => [products];
}
