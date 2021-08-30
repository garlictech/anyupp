import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/GeneratedProductCategory.dart';
import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/GeneratedProduct.dart';

import 'product_provider_interface.dart';
import 'package:fa_prev/graphql/graphql.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<ProductCategory>?> getProductCategoryList(String chainId, String unitId) async* {
    print('***** getProductCategoryList().start().chainId=$chainId, unitId=$unitId');

    try {
      var result = await GQL.amplify.execute(ListGeneratedProductCategoriesQuery(
        variables: ListGeneratedProductCategoriesArguments(
          unitId: unitId,
        ),
      ));

      if (result.data == null || result.data?.listGeneratedProductCategorys == null) {
        yield null;
        return;
      }

      var items = result.data?.listGeneratedProductCategorys?.items;
      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeneratedProductCategory.fromJson(items[i]!.toJson()).productCategory);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));
      yield results;
    } on Exception catch (e) {
      print('***** getProductCategoryList().error=$e');
      yield null;
    }
  }

  @override
  Stream<List<GeneratedProduct>?> getProductList(String unitId, String categoryId) async* {
    print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');

    try {
      var result = await GQL.amplify.execute(ListProductsQuery(
        variables: ListProductsArguments(
          unitId: unitId,
          categoryId: categoryId,
        ),
      ));

      if (result.data == null || result.data?.listGeneratedProducts == null) {
        yield null;
        return;
      }

      var items = result.data?.listGeneratedProducts?.items;
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeneratedProduct product = GeneratedProduct.fromJson(items[i]!.toJson());
          results.add(product);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));
      yield results;
    } on Exception catch (e) {
      print('***** getProductList().error=$e');
      yield null;
    }
  }
}
