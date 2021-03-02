import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/Product.dart';
import 'package:fa_prev/shared/affiliate/utils/aws_dummy_utils.dart';

import 'product_provider_interface.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<String>> getNotEmptyProductCategoryList(String unitId) {
      // TODO: AWS
      return AwsDummyUtils.list<String>();
    }
  
    @override
    Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
      // TODO: AWS
    return AwsDummyUtils.list<ProductCategory>();
    }
  
    @override
    Stream<List<Product>> getProductList(String unitId, String categoryId) {
      // TODO: AWS
    return AwsDummyUtils.list<Product>();
  }
}
