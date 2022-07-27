import '/models.dart';
import '/shared/pagination/pagination.dart';

abstract class IProductProvider {
  Future<PageResponse<ProductCategory>> getProductCategoryList(String chainId,
      [String? nextToken]);

  Future<PageResponse<GeneratedProduct>> getAllProductList({
    required String unitId,
    required String chainId,
    String? nextToken,
  });
}
