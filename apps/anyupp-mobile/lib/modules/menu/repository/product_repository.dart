import '/models.dart';

import '/modules/menu/menu.dart';
import '/shared/pagination/pagination.dart';

class ProductRepository {
  final IProductProvider _provider;

  ProductRepository(this._provider);

  Future<PageResponse<ProductCategory>> getProductCategoryList(String chainId,
      [String? nextToken]) {
    return _provider.getProductCategoryList(chainId, nextToken);
  }

  Future<PageResponse<GeneratedProduct>> getAllProductList({
    required String chainId,
    required String unitId,
    String? nextToken,
  }) {
    return _provider.getAllProductList(
      unitId: unitId,
      chainId: chainId,
      nextToken: nextToken,
    );
  }
}
