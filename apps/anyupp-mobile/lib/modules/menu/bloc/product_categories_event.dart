part of 'product_categories_bloc.dart';

abstract class ProductCategoriesEvent extends Equatable {
  const ProductCategoriesEvent();

  @override
  List<Object?> get props => [];
}

class LoadProductCategories extends ProductCategoriesEvent {
  final String chainId;
  const LoadProductCategories(this.chainId);

  @override
  List<Object?> get props => [chainId];
}
