import 'package:fa_prev/models.dart';

import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

class ProductRepository {
  final IProductProvider _provider;

  ProductRepository(this._provider);

  Future<PageResponse<ProductCategory>> getProductCategoryList(String unitId,
      [String? nextToken]) {
    return _provider.getProductCategoryList(unitId, nextToken);
  }

  Future<PageResponse<GeneratedProduct>> getProductList(
      String unitId, String categoryId,
      [String? nextToken]) {
    return _provider.getProductList(unitId, categoryId, nextToken);
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
