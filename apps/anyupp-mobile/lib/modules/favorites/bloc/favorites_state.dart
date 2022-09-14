import 'package:equatable/equatable.dart';
import '/models.dart';

abstract class FavoritesState extends Equatable {
  const FavoritesState();
  @override
  List<Object?> get props => [];
}

class FavoritesNotLoaded extends FavoritesState {
  const FavoritesNotLoaded();
}

class FavoritesLoading extends FavoritesState {
  const FavoritesLoading();
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

class FavorteAddedOrRemoved extends FavoritesState {
  final List<FavoriteProduct>? favorites;
  const FavorteAddedOrRemoved(this.favorites);
  @override
  List<Object?> get props => [favorites];
}
