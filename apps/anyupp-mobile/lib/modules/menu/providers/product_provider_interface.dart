import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

abstract class IProductProvider {
  Future<PageResponse<ProductCategory>> getProductCategoryList(String chainId,
      [String? nextToken]);

  Future<PageResponse<GeneratedProduct>> getAllProductList({
    required String unitId,
    required String chainId,
    String? nextToken,
  });
}
