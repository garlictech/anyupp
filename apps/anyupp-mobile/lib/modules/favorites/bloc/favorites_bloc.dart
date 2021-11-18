import 'package:fa_prev/modules/favorites/bloc/favorites_event.dart';
import 'package:fa_prev/modules/favorites/bloc/favorites_state.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FavoritesBloc extends Bloc<FavoritesEvent, FavoritesState> {
  final FavoritesRepository _favoritesRepository;

  FavoritesBloc(this._favoritesRepository) : super(FavoritesNotLoaded());

  @override
  Stream<FavoritesState> mapEventToState(FavoritesEvent event) async* {
    if (event is ResetFavoritesList) {
      _favoritesRepository.resetFavoritesList();
      yield FavoritesNotLoaded();
    }

    if (event is ListFavoriteProducts) {
      yield FavoritesLoading();
      var response = await _favoritesRepository.getFavoritesList(
        event.unitId,
        event.nextToken,
      );
      yield FavoriteListLoaded(response.data);
      return;
    }

    if (event is AddOrRemoveFavoriteProduct) {
      bool isFavorite = await _favoritesRepository.addOrRemoveFavoriteProduct(
        event.unitId,
        event.categoryId,
        event.productId,
      );
      yield ProductIsFavorite(isFavorite);
      yield FavoriteListLoaded(_favoritesRepository.favorites);
      return;
    }

    if (event is CheckProductIsFavorite) {
      yield FavoritesLoading();
      bool isFavorite = await _favoritesRepository.checkIfProductIsFavorite(
        event.unitId,
        event.productId,
      );
      yield ProductIsFavorite(isFavorite);
      yield FavoriteListLoaded(_favoritesRepository.favorites);
      return;
    }
  }
}
