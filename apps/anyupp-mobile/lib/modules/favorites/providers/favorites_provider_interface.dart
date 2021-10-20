import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/pagination/model/page_response.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

abstract class IFavoritesProvider {
  Future<PageResponse<FavoriteProduct>> getFavoritesList(String unitId, [ServingMode? servingMode, String? nextToken]);

  Future<bool> addOrRemoveFavoriteProduct(String unitId, String categoryId, String productId);

  Future<bool> checkIfProductIsFavorite(String unitId, String productId);

  List<FavoriteProduct>? get favorites;
}
