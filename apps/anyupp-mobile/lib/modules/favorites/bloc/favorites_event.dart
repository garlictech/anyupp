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

  const AddOrRemoveFavoriteProduct(this.unitId, this.categoryId, this.productId);
}

class ListFavoriteProducts extends FavoritesEvent {
  final String unitId;
  final String? nextToken;

  ListFavoriteProducts({
    required this.unitId,
    this.nextToken,
  });
}

class ResetFavoritesList extends FavoritesEvent {}
