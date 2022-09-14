import 'dart:async';

import '/modules/favorites/favorites.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FavoritesBloc extends Bloc<FavoritesEvent, FavoritesState> {
  final FavoritesRepository _favoritesRepository;

  FavoritesBloc(this._favoritesRepository) : super(FavoritesNotLoaded()) {
    on<ResetFavoritesList>(_onResetFavoritesList);
    on<ListFavoriteProducts>(_onListFavoriteProducts);
    on<AddOrRemoveFavoriteProduct>(_onAddOrRemoveFavoriteProduct);
    on<CheckProductIsFavorite>(_onCheckProductIsFavorite);
  }

  FutureOr<void> _onResetFavoritesList(
      ResetFavoritesList event, Emitter<FavoritesState> emit) {
    _favoritesRepository.resetFavoritesList();
    emit(FavoritesNotLoaded());
  }

  FutureOr<void> _onListFavoriteProducts(
      ListFavoriteProducts event, Emitter<FavoritesState> emit) async {
    emit(FavoritesLoading());
    var response = await _favoritesRepository.getFavoritesList(
      event.unitId,
      event.nextToken,
    );
    emit(FavoriteListLoaded(response.data));
  }

  FutureOr<void> _onAddOrRemoveFavoriteProduct(
      AddOrRemoveFavoriteProduct event, Emitter<FavoritesState> emit) async {
    emit(FavoritesLoading());
    bool isFavorite = await _favoritesRepository.addOrRemoveFavoriteProduct(
      event.unitId,
      event.categoryId,
      event.productId,
    );
    emit(FavorteAddedOrRemoved(_favoritesRepository.favorites));
    emit(ProductIsFavorite(isFavorite));
    emit(FavoriteListLoaded(_favoritesRepository.favorites));
  }

  FutureOr<void> _onCheckProductIsFavorite(
      CheckProductIsFavorite event, Emitter<FavoritesState> emit) async {
    emit(FavoritesLoading());
    bool isFavorite = await _favoritesRepository.checkIfProductIsFavorite(
      event.unitId,
      event.productId,
    );
    emit(ProductIsFavorite(isFavorite));
    emit(FavoriteListLoaded(_favoritesRepository.favorites));
  }
}
