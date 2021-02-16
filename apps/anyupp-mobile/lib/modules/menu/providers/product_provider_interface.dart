import 'package:fa_prev/shared/models.dart';

abstract class IProductProvider {
  
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId);

  Stream<List<String>> getNotEmptyProductCategoryList(String unitId);
  
  Stream<List<Product>> getProductList(String unitId, String categoryId);
}
