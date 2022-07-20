import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/utils/generated_product_converter.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'product_provider_interface.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Future<PageResponse<ProductCategory>> getProductCategoryList(String chainId,
      [String? nextToken]) async {
    log.d('***** getProductCategoryList().start().chainId=$chainId');

    try {
      var result = await GQL.amplify.execute(ListProductCategoriesQuery(
        variables: ListProductCategoriesArguments(
          chainId: chainId, // TODO kideriteni miert chainId kell.
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        log.d('***** getProductCategoryList().error=${result.errors}');
        // var error = result.errors![0];
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.searchProductCategories == null) {
        return PageResponse(data: null);
      }

      int count = result.data?.searchProductCategories?.total ?? 0;
      String? token = result.data?.searchProductCategories?.nextToken;
      log.d(
          '***** getProductCategoryList().totalCount=$count, nextToken=$token');

      var items = result.data?.searchProductCategories?.items;

      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(ProductCategory.fromJson(items[i]!.toJson()));
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
  Future<PageResponse<GeneratedProduct>> getAllProductList(
      {required String unitId,
      required String chainId,
      String? nextToken}) async {
    try {
      log.d('***** getAllProductList().unitId=$unitId, chainId=$chainId');
      var result = await GQL.amplify.execute(ListAllProductsQuery(
        variables: ListAllProductsArguments(
          chainId: chainId,
          nextToken: nextToken,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.searchUnitProducts == null) {
        log.d('***** getAllProductList().empty results');
        return PageResponse(data: null);
      }

      // Load Config Components and Config sets for Chain
      Map<String, ProductComponentSet> componentSets = {};
      Map<String, ProductComponent> components = {};
      await Future.wait(
        [
          (() async => componentSets = await _getChainProductSets(chainId))(),
          (() async =>
              components = await _getChainProductComponents(chainId))(),
        ],
      );
      // log.d('ComponentSets=${componentSets}');
      // log.d('Components=${components}');
      log.d(
          '***** getAllProductList().searchUnitProducts.items.length=${result.data?.searchUnitProducts?.items.length}');

      int count = result.data?.searchUnitProducts?.total ?? 0;
      String? token = result.data?.searchUnitProducts?.nextToken;
      var items = result.data?.searchUnitProducts?.items;
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          // GeneratedProduct product =
          //     GeneratedProduct.fromJson(items[i]!.toJson());
          GeneratedProduct? product =
              getProductFromQuery(items[i]!, componentSets, components);
          if (product != null) {
            product.variants
                .sort((v1, v2) => v1.position.compareTo(v2.position));
            product.configSets?.sort(
                (c1, c2) => c1.position?.compareTo(c2.position ?? 0) ?? 0);
            product.configSets?.forEach(
              (configSet) => configSet.items.sort(
                  (i1, i2) => i1.position?.compareTo(i2.position ?? 0) ?? 0),
            );
            results.add(product);
          }
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));
      // results.groupBy((c) => c.productCategoryId);
      log.d('***** getAllProductList().items.length=${results.length}');

      return PageResponse(
        data: results,
        totalCount: count,
        nextToken: token,
      );
    } on Exception catch (e) {
      log.e('***** getAllProductList().error=$e');
      rethrow;
    }
  }

  Future<Map<String, ProductComponentSet>> _getChainProductSets(
    String chainId,
  ) async {
    var result = await GQL.amplify.execute(
      ListChainProductComponentSetsQuery(
        variables: ListChainProductComponentSetsArguments(
          chainId: chainId,
        ),
      ),
      fetchPolicy: FetchPolicy.cacheFirst,
    );

    if (result.hasErrors) {
      log.d('AwsUnitProvider._getGroup().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    return Map.fromIterable(
        result.data?.searchProductComponentSets?.items ?? [],
        key: (v) => v.id,
        value: (v) => v);
  }

  Future<Map<String, ProductComponent>> _getChainProductComponents(
    String chainId,
  ) async {
    var result = await GQL.amplify.execute(
      ListChainProductComponentsQuery(
        variables: ListChainProductComponentsArguments(
          chainId: chainId,
        ),
      ),
      fetchPolicy: FetchPolicy.cacheFirst,
    );

    if (result.hasErrors) {
      log.d('AwsUnitProvider._getGroup().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    return Map.fromIterable(result.data?.searchProductComponents?.items ?? [],
        key: (v) => v.id, value: (v) => v);
  }
}
