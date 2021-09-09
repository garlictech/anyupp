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
  const LoadProductList({required this.unitId, required this.categoryId, this.nextToken});

  @override
  List<Object?> get props => [unitId, categoryId, nextToken];
}
