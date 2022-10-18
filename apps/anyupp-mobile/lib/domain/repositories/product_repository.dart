import '/models.dart';
import '/shared/pagination/pagination.dart';

abstract class ProductRepository {
  Future<PageResponse<ProductCategory>> getProductCategoryList(
      String ownerEntity,
      [String? nextToken]);

  Future<PageResponse<Product>> getAllProductList({
    required String unitId,
    String? nextToken,
  });

  Future<Product> getProduct(String productId);
}
