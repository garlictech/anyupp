part of 'product_categories_bloc.dart';

abstract class ProductCategoriesEvent extends Equatable {
  const ProductCategoriesEvent();

  @override
  List<Object?> get props => [];
}

class LoadProductCategories extends ProductCategoriesEvent {
  final String unitId;
  const LoadProductCategories(this.unitId);

  @override
  List<Object?> get props => [unitId];
}
