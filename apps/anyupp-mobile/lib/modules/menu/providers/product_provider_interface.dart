import '/models.dart';
import '/shared/pagination/pagination.dart';

abstract class IProductProvider {
  Future<PageResponse<ProductCategory>> getProductCategoryList(
      String ownerEntity,
      [String? nextToken]);

  Future<PageResponse<GeneratedProduct>> getAllProductList({
    required String unitId,
    String? nextToken,
  });
}
