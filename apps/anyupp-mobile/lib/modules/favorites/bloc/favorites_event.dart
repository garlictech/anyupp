abstract class FavoritesEvent {
  const FavoritesEvent();
}

class CheckProductIsFavorite extends FavoritesEvent {
  final String productId;
  final String chainId;
  final String unitId;

  const CheckProductIsFavorite(this.chainId, this.unitId, this.productId);
}

class AddOrRemoveFavoriteProduct extends FavoritesEvent {
  final String productId;
  final String chainId;
  final categoryId;
  final String unitId;

  const AddOrRemoveFavoriteProduct(this.chainId, this.unitId,  this.categoryId, this.productId);
}
// TODO ide kell meg a favorites lista!!!
