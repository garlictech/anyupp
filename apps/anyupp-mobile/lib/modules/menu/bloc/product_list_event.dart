part of 'product_list_bloc.dart';

//import 'package:equatable/equatable.dart';

abstract class ProductListEvent extends Equatable {
  const ProductListEvent();

  @override
  List<Object?> get props => [];
}

class LoadAllProductList extends ProductListEvent {
  final String unitId;
  final String chainId;
  final String? nextToken;
  const LoadAllProductList({
    required this.unitId,
    required this.chainId,
    this.nextToken,
  });

  @override
  List<Object?> get props => [unitId, chainId, nextToken];
}

class RefreshFavoritesInProductList extends ProductListEvent {
  final List<FavoriteProduct>? favorites;

  const RefreshFavoritesInProductList({this.favorites});
}
