import 'package:fa_prev/graphql/generated/crud-api.dart';

abstract class FavoritesEvent {
  const FavoritesEvent();
}

class CheckProductIsFavorite extends FavoritesEvent {
  final String unitId;
  final String productId;

  const CheckProductIsFavorite(this.unitId, this.productId);
}

class AddOrRemoveFavoriteProduct extends FavoritesEvent {
  final String unitId;
  final categoryId;
  final String productId;

  const AddOrRemoveFavoriteProduct(
      this.unitId, this.categoryId, this.productId);
}

class ListFavoriteProducts extends FavoritesEvent {
  final String unitId;
  final ServingMode servingMode;
  final String? nextToken;

  ListFavoriteProducts({
    required this.unitId,
    required this.servingMode,
    this.nextToken,
  });
}
