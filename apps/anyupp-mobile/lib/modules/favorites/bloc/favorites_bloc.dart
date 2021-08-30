import 'package:fa_prev/modules/favorites/bloc/favorites_event.dart';
import 'package:fa_prev/modules/favorites/bloc/favorites_state.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FavoritesBloc extends Bloc<FavoritesEvent, FavoritesState> {
  final FavoritesRepository _favoritesRepository;

  FavoritesBloc(this._favoritesRepository) : super(FavoritesNotLoaded());

  @override
  Stream<FavoritesState> mapEventToState(FavoritesEvent event) async* {
    // TODO ide kell meg a favorites lista!!!
    if (event is AddOrRemoveFavoriteProduct) {
      bool isFavorite = await _favoritesRepository.addOrRemoveFavoriteProduct(
          event.chainId, event.unitId, event.categoryId, event.productId);
      yield ProductIsFavorite(isFavorite);
      return;
    }

    if (event is CheckProductIsFavorite) {
      yield FavoritesLoading();
      bool isFavorite =
          await _favoritesRepository.checkIfProductIsFavorite(event.chainId, event.unitId, event.productId);
      yield ProductIsFavorite(isFavorite);
      return;
    }
  }
}
