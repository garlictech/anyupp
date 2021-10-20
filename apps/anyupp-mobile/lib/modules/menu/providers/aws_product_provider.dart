import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/GeneratedProductCategory.dart';
import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

import 'product_provider_interface.dart';
import 'package:fa_prev/graphql/graphql.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Future<PageResponse<ProductCategory>> getProductCategoryList(String unitId, [String? nextToken]) async {
    print('***** getProductCategoryList().start().unitId=$unitId');

    try {
      var result = await GQL.amplify.execute(ListGeneratedProductCategoriesQuery(
        variables: ListGeneratedProductCategoriesArguments(
          unitId: unitId,
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        print('***** getProductCategoryList().error=${result.errors}');
        // var error = result.errors![0];
        throw GraphQLException.fromGraphQLError(GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.searchGeneratedProductCategorys == null) {
        return PageResponse(data: null);
      }

      int count = result.data?.searchGeneratedProductCategorys?.total ?? 0;
      String? token = result.data?.searchGeneratedProductCategorys?.nextToken;
      print('***** getProductCategoryList().totalCount=$count, nextToken=$token');

      var items = result.data?.searchGeneratedProductCategorys?.items;

      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeneratedProductCategory.fromJson(items[i]!.toJson()).productCategory);
        }
      }
      print('***** getProductCategoryList().results=${results.length}');
      results.sort((a, b) => a.position.compareTo(b.position));
      return PageResponse(
        data: results,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      print('***** getProductCategoryList().error=$e');
      rethrow;
      // return PageResponse(data: null);
    }
  }

  @override
  Future<PageResponse<GeneratedProduct>> getProductList(String unitId, String categoryId, [String? nextToken]) async {
    print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');
    try {
      var result = await GQL.amplify.execute(ListProductsQuery(
        variables: ListProductsArguments(
          unitId: unitId,
          categoryId: categoryId,
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        print('***** getProductList().error=${result.errors}');
        throw GraphQLException.fromGraphQLError(GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.searchGeneratedProducts == null) {
        print('***** getProductList().empty results');
        return PageResponse(data: null);
      }

      int count = result.data?.searchGeneratedProducts?.total ?? 0;
      String? token = result.data?.searchGeneratedProducts?.nextToken;
      print('***** getProductList().totalCount=$count, nextToken=$token');
      var items = result.data?.searchGeneratedProducts?.items;
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeneratedProduct product = GeneratedProduct.fromJson(items[i]!.toJson());
          results.add(product);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));
      print('***** getProductList().items.length=${results.length}');

      return PageResponse(
        data: results,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      print('***** getProductList().error=$e');
      // return PageResponse(data: null);
      rethrow;
    }
  }
}
