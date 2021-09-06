import 'package:equatable/equatable.dart';

abstract class FavoritesState extends Equatable {
  const FavoritesState();
}

class FavoritesNotLoaded extends FavoritesState {
  const FavoritesNotLoaded();

  @override
  List<Object?> get props => [];
}

class FavoritesLoading extends FavoritesState {
  const FavoritesLoading();
  @override
  List<Object?> get props => [];
}

class ProductIsFavorite extends FavoritesState {
  final bool isFavorite;

  const ProductIsFavorite(this.isFavorite);
  @override
  List<Object?> get props => [isFavorite];
}
