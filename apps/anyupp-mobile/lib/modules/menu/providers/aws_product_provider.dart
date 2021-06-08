import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/ProductCategory.dart';

import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'product_provider_interface.dart';
import 'package:fa_prev/graphql/graphql.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) async* {
    print('***** getProductCategoryList().start().chainId=$chainId, unitId=$unitId');

    try {
      QueryResult result = await GQL.amplify.executeQuery(
        query: QUERY_LIST_PRODUCT_CATEGORIES,
        variables: {
          'chainId': chainId,
        },
      );

      if (result.data == null || result.data['listProductCategorys'] == null) {
        yield null;
        return;
      }

      List<dynamic> items = result.data['listProductCategorys']['items'];
      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(ProductCategory.fromJson(Map<String, dynamic>.from(items[i])));
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
  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) async* {
    // print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');

    try {
      QueryResult result = await GQL.amplify.executeQuery(query: QUERY_LIST_PRODUCTS, variables: {
        'unitId': unitId,
        'categoryId': categoryId,
      });

      if (result.data == null || result.data['listGeneratedProducts'] == null) {
        yield null;
        return;
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
      results.sort((a, b) => a.position.compareTo(b.position));
      yield results;
    } on Exception catch (e) {
      print('***** getProductList().error=$e');
      yield null;
    }
  }
}
