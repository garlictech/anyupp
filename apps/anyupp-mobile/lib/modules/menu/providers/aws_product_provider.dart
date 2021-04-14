import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'product_provider_interface.dart';
import 'package:fa_prev/graphql/graphql.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
    print('***** getProductCategoryList().start().chainId=$chainId, unitId=$unitId');
    return _getWithGraphQL(chainId, unitId);
  }

  Stream<List<ProductCategory>> _getWithGraphQL(String chainId, String unitId) async* {
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_LIST_PRODUCT_CATEGORIES),
        variables: {
          'chainId': chainId,
        },
      ));

      print('getProductCategoryList.result=$result');

      List<dynamic> items = result.data['listProductCategorys']['items'];
      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(ProductCategory.fromJson(Map<String, dynamic>.from(items[i])));
        }
      }

      yield results;
    } on Exception catch (e) {
      print('AwsUnitProvider.getProductCategoryList.Exception: $e');
      rethrow;
    }
  }

  @override
  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) async* {
    // print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_LIST_PRODUCTS),
        variables: {
          'unitId': unitId,
          'categoryId': categoryId,
        },
      ));

      List<dynamic> items = result.data['listGeneratedProducts']['items'];
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeneratedProduct.fromJson(Map<String, dynamic>.from(items[i])));
        }
      }

      yield results;
    } on Exception catch (e) {
      print('AwsUnitProvider.getProductList.Exception: $e');
      rethrow;
    }
  }
}
