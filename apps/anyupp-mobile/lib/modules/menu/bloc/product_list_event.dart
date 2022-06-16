part of 'product_list_bloc.dart';

//import 'package:equatable/equatable.dart';

abstract class ProductListEvent extends Equatable {
  const ProductListEvent();

  @override
  List<Object?> get props => [];
}

class LoadProductList extends ProductListEvent {
  final String unitId;
  final String categoryId;
  final String? nextToken;
  const LoadProductList(
      {required this.unitId, required this.categoryId, this.nextToken});

  @override
  List<Object?> get props => [unitId, categoryId, nextToken];
}

class LoadAllProductList extends ProductListEvent {
  final String unitId;
  final String? nextToken;
  const LoadAllProductList({required this.unitId, this.nextToken});

  @override
  List<Object?> get props => [unitId, nextToken];
}

class RefreshFavoritesInProductList extends ProductListEvent {
  final List<FavoriteProduct>? favorites;

  const RefreshFavoritesInProductList({this.favorites});
}
