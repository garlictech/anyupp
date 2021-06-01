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
    ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
    QueryResult result = await _client.value.query(QueryOptions(
      document: gql(QUERY_LIST_PRODUCT_CATEGORIES),
      variables: {
        'chainId': chainId,
      },
    ));

      print('getProductCategoryList.result=$result');
      if (result.hasException) {
        print('getProductCategoryList().error=${result.exception}'); // TODO
        // yield null;
        // throw result.exception;
        yield null;
      }

    List<dynamic> items = result.data['listProductCategorys']['items'];
    List<ProductCategory> results = [];
    if (items != null) {
      for (int i = 0; i < items.length; i++) {
        results.add(ProductCategory.fromJson(Map<String, dynamic>.from(items[i])));
      }
    }

    yield results;
  }

  @override
  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) async* {
    // print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');

    // QueryResult result = await executeQuery(query: QUERY_LIST_PRODUCTS, variables: {
    //     'unitId': unitId,
    //     'categoryId': categoryId,
    //   });

    ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
    QueryResult result = await _client.value.query(QueryOptions(
      document: gql(QUERY_LIST_PRODUCTS),
      variables: {
        'unitId': unitId,
        'categoryId': categoryId,
      },
    ));
    // print('getProductList.result=$result');
    if (result.hasException) {
      print('getProductList().error=${result.exception}'); // TODO
      throw result.exception;
    }
    List<dynamic> items = result.data['listGeneratedProducts']['items'];
    List<GeneratedProduct> results = [];
    if (items != null) {
      for (int i = 0; i < items.length; i++) {
        Map<String, dynamic> json = Map<String, dynamic>.from(items[i]);
        // TODO ADD HACKED CONFIGURATIONS SETS!!!!
        try {
          results.add(GeneratedProduct.fromJson(json));
        } on Error catch (e) {
          print('listGeneratedProducts.error()');
          FlutterError.dumpErrorToConsole(FlutterErrorDetails(exception: e));
        }
      }
    }

    yield results;
  }
}
