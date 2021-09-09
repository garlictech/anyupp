import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';

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

class FavoriteListLoaded extends FavoritesState {
  final List<FavoriteProduct>? favorites;
  const FavoriteListLoaded(this.favorites);
  @override
  List<Object?> get props => [favorites];
}
