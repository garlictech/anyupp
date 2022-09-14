import 'dart:async';

import '/modules/favorites/favorites.dart';
import '/models.dart';
import '/shared/pagination/pagination.dart';

class FavoritesRepository implements IFavoritesProvider {
  final IFavoritesProvider _provider;

  FavoritesRepository(this._provider);

  @override
  Future<PageResponse<FavoriteProduct>> getFavoritesList(String unitId, [String? nextToken]) {
    return _provider.getFavoritesList(unitId, nextToken);
  }

  @override
  Future<bool> addOrRemoveFavoriteProduct(String unitId, String categoryId, String productId) async {
    return _provider.addOrRemoveFavoriteProduct(unitId, categoryId, productId);
  }

  @override
  Future<bool> checkIfProductIsFavorite(String unitId, String productId) async {
    return _provider.checkIfProductIsFavorite(unitId, productId);
  }

  @override
  List<FavoriteProduct>? get favorites => _provider.favorites;

  @override
  void resetFavoritesList() {
    _provider.resetFavoritesList();
  }
}
