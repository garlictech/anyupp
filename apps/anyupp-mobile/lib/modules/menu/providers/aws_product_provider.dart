import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/Product.dart';

import 'product_provider_interface.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<String>> getNotEmptyProductCategoryList(String unitId) {
      // TODO: implement getNotEmptyProductCategoryList
      throw UnimplementedError();
    }
  
    @override
    Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
      // TODO: implement getProductCategoryList
      throw UnimplementedError();
    }
  
    @override
    Stream<List<Product>> getProductList(String unitId, String categoryId) {
    // TODO: implement getProductList
    throw UnimplementedError();
  }
}
