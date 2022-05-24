import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/GeneratedProductCategory.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

import 'product_provider_interface.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Future<PageResponse<ProductCategory>> getProductCategoryList(String unitId,
      [String? nextToken]) async {
    log.d('***** getProductCategoryList().start().unitId=$unitId');

    try {
      var result =
          await GQL.amplify.execute(ListGeneratedProductCategoriesQuery(
        variables: ListGeneratedProductCategoriesArguments(
          unitId: unitId,
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        log.d('***** getProductCategoryList().error=${result.errors}');
        // var error = result.errors![0];
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null ||
          result.data?.searchGeneratedProductCategories == null) {
        return PageResponse(data: null);
      }

      int count = result.data?.searchGeneratedProductCategories?.total ?? 0;
      String? token = result.data?.searchGeneratedProductCategories?.nextToken;
      log.d(
          '***** getProductCategoryList().totalCount=$count, nextToken=$token');

      var items = result.data?.searchGeneratedProductCategories?.items;

      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeneratedProductCategory.fromJson(items[i]!.toJson())
              .productCategory);
        }
      }
      log.d('***** getProductCategoryList().results=${results.length}');
      results.sort((a, b) => a.position.compareTo(b.position));
      return PageResponse(
        data: results,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      log.e('***** getProductCategoryList().error=$e');
      rethrow;
      // return PageResponse(data: null);
    }
  }

  @override
  Future<PageResponse<GeneratedProduct>> getProductList(
      String unitId, String categoryId,
      [String? nextToken]) async {
    try {
      var result = await GQL.amplify.execute(ListProductsQuery(
        variables: ListProductsArguments(
          unitId: unitId,
          categoryId: categoryId,
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.searchGeneratedProducts == null) {
        log.d('***** getProductList().empty results');
        return PageResponse(data: null);
      }

      int count = result.data?.searchGeneratedProducts?.total ?? 0;
      String? token = result.data?.searchGeneratedProducts?.nextToken;
      var items = result.data?.searchGeneratedProducts?.items;
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeneratedProduct product =
              GeneratedProduct.fromJson(items[i]!.toJson());
          product.variants.sort((v1, v2) => v1.position.compareTo(v2.position));
          product.configSets
              ?.sort((c1, c2) => c1.position?.compareTo(c2.position ?? 0) ?? 0);
          product.configSets?.forEach(
            (configSet) => configSet.items.sort(
                (i1, i2) => i1.position?.compareTo(i2.position ?? 0) ?? 0),
          );
          results.add(product);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));
      // log.d('***** getProductList().items.length=${results.length}');

      return PageResponse(
        data: results,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      log.e('***** getProductList().error=$e');
      rethrow;
    }
  }
}
