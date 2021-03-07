import 'package:fa_prev/models.dart';

import 'package:fa_prev/modules/menu/menu.dart';

class ProductRepository  {
  final IProductProvider _provider;

  ProductRepository(this._provider);

  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
    return _provider.getProductCategoryList(chainId, unitId);
  }

  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) {
    return _provider.getProductList(unitId, categoryId);
  }
}
