import 'package:fa_prev/models/Product.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  @override
  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) {
      // TODO: implement addOrRemoveFavoriteProduct
      throw UnimplementedError();
    }
  
    @override
    Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId) {
      // TODO: implement checkIfProductIsFavorite
      throw UnimplementedError();
    }
  
    @override
    Stream<List<Product>> getFavoritesList(String chainId, String unitId) {
    // TODO: implement getFavoritesList
    throw UnimplementedError();
  }

}
