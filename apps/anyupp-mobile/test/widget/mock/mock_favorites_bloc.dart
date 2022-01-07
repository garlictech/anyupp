import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:mockito/mockito.dart';

class MockFavoritesRepository extends Mock implements FavoritesRepository {}

class MockFavoritesBloc extends FavoritesBloc {
  MockFavoritesBloc() : super(MockFavoritesRepository()) {
    on<ListFavoriteProducts>((event, emit) {
      emit(FavoritesLoading());
      emit(FavoriteListLoaded([]));
    });
    on<AddOrRemoveFavoriteProduct>((event, emit) {
      emit(FavoritesLoading());
      emit(FavoriteListLoaded([]));
    });
    on<CheckProductIsFavorite>((event, emit) {
      emit(FavoritesLoading());
      emit(ProductIsFavorite(true));
      emit(FavoriteListLoaded([]));
    });
  }
}
