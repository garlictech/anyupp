import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

abstract class IProductProvider {
  Future<PageResponse<ProductCategory>> getProductCategoryList(String unitId,
      [String? nextToken]);

  Future<PageResponse<GeneratedProduct>> getProductList(
      String unitId, String categoryId,
      [String? nextToken]);

  Future<PageResponse<GeneratedProduct>> getAllProductList(String unitId,
      [String? nextToken]);
}
