import 'dart:async';

import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/models.dart';

class FavoritesRepository {
  final IFavoritesProvider _provider;

  FavoritesRepository(this._provider);

  Stream<List<Product>> getFavoritesList(String chainId, String unitId) {
    return _provider.getFavoritesList(chainId, unitId);
  }

  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) async {
    return _provider.addOrRemoveFavoriteProduct(chainId, unitId, categoryId, productId);
  }

  Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId) async {
    return _provider.checkIfProductIsFavorite(chainId, unitId, productId);
  }
}
