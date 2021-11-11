import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:mockito/mockito.dart';

class MockFavoritesRepository extends Mock implements FavoritesRepository {}

class MockFavoritesBloc extends FavoritesBloc {
  MockFavoritesBloc() : super(MockFavoritesRepository());

  @override
  Stream<FavoritesState> mapEventToState(FavoritesEvent event) async* {
    if (event is ListFavoriteProducts) {
      yield FavoritesLoading();
      yield FavoriteListLoaded([]);
      return;
    }

    if (event is AddOrRemoveFavoriteProduct) {
      yield FavoritesLoading();
      yield ProductIsFavorite(true);
      yield FavoriteListLoaded([]);
      return;
    }

    if (event is CheckProductIsFavorite) {
      yield FavoritesLoading();
      yield ProductIsFavorite(true);
      yield FavoriteListLoaded([]);
      return;
    }
  }
}
