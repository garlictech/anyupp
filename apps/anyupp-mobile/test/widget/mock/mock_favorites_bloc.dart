import 'package:anyupp/modules/favorites/favorites.dart';
import 'package:mockito/mockito.dart';

class MockFavoritesRepository extends Mock implements FavoritesRepository {}

class MockFavoritesBloc extends Fake implements FavoritesBloc {
  final FavoritesState _state;

  MockFavoritesBloc([this._state = const FavoritesNotLoaded()]);

  FavoritesState get state => _state;
  void add(FavoritesEvent event) {}
  Stream<FavoritesState> get stream => Stream.value(_state);
  Future<void> close() async => {};
}

// class MockFavoritesBloc extends FavoritesBloc {
//   MockFavoritesBloc() : super(MockFavoritesRepository()) {
//     on<ListFavoriteProducts>((event, emit) {
//       emit(FavoritesLoading());
//       emit(FavoriteListLoaded([]));
//     });
//     on<AddOrRemoveFavoriteProduct>((event, emit) {
//       emit(FavoritesLoading());
//       emit(FavoriteListLoaded([]));
//     });
//     on<CheckProductIsFavorite>((event, emit) {
//       emit(FavoritesLoading());
//       emit(ProductIsFavorite(true));
//       emit(FavoriteListLoaded([]));
//     });
//   }
// }
