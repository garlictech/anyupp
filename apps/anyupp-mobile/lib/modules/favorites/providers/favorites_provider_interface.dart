import '/models.dart';
import '/shared/pagination/model/page_response.dart';

abstract class IFavoritesProvider {
  Future<PageResponse<FavoriteProduct>> getFavoritesList(String unitId, [String? nextToken]);

  Future<bool> addOrRemoveFavoriteProduct(String unitId, String categoryId, String productId);

  Future<bool> checkIfProductIsFavorite(String unitId, String productId);

  List<FavoriteProduct>? get favorites;

  void resetFavoritesList();
}
