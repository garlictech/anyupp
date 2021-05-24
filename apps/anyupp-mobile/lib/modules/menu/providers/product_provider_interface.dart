import 'package:fa_prev/models.dart';

abstract class IProductProvider {
  
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId);

  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId);
}
