import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/shared/affiliate/utils/aws_dummy_utils.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  @override
  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) async {
    // TODO: implement addOrRemoveFavoriteProduct
    throw UnimplementedError();
  }

  @override
  Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId) async {
    // TODO AWS
    return false;
  }

  @override
  Stream<List<GeneratedProduct>> getFavoritesList(String chainId, String unitId) {
    // TODO AWS
    return AwsDummyUtils.list<GeneratedProduct>();
  }
}
