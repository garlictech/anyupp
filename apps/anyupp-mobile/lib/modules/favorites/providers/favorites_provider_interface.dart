import 'package:fa_prev/models.dart';

abstract class IFavoritesProvider {
  Stream<List<GeneratedProduct>> getFavoritesList(String chainId, String unitId);

  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId);

  Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId);
}
