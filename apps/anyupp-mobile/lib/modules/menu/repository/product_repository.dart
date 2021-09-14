import 'package:fa_prev/models.dart';

import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

class ProductRepository {
  final IProductProvider _provider;

  ProductRepository(this._provider);

  Future<PageResponse<ProductCategory>> getProductCategoryList(String unitId, [String? nextToken]) {
    return _provider.getProductCategoryList(unitId);
  }

  Future<PageResponse<GeneratedProduct>> getProductList(String unitId, String categoryId, [String? nextToken]) {
    return _provider.getProductList(unitId, categoryId);
  }
}
