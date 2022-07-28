import 'package:flutter/foundation.dart';

import '../../domain/repositories/product.dart';
import '/services/graphql/graphql.dart';
import '../../domain/entities/entities.dart';

class ProductRepositoryAppsync implements ProductRepository {
  final AmplifyApi _amplifyApi;

  ProductRepositoryAppsync(this._amplifyApi);

  @override
  Future<List<Product>> getProductsOfUnit(String unitId) async {
    String gqlDocument = ''' 
        query Search {
          searchUnitProducts(filter: {unitId: {eq: "$unitId"}}) {
          items {
            id
            parentId
            variants {
              id
              variantName {
                hu
              }
            }
          }
          }
        }
    ''';

    final result = await _amplifyApi.execute(gqlDocument);

    final items = result['searchUnitProducts']['items'];

    xxx(dynamic val) async {
      final productName = await _getProductName(val['parentId']);
      val['name'] = productName;
      return Future.value(true);
    }

    for (var entry in items) {
      await xxx(entry);
    }

    return items.map<Product>((item) => Product.fromJson(item)).toList();
  }

  _getProductName(String id) async {
    String gqlDocumentGroupProd = ''' 
        query GetGroupProduct {
          getGroupProduct(id: "$id") {
            parentId
          }
        }
    ''';

    final chainProdResult = await _amplifyApi.execute(gqlDocumentGroupProd);
    final chainProdId = chainProdResult['getGroupProduct']['parentId'];

    String gqlDocumentChainProd = ''' 
        query GetChainProduct {
          getChainProduct(id: "$chainProdId") {
            name {
              hu
            }
          }
        }
    ''';

    return (await _amplifyApi.execute(gqlDocumentChainProd))['getChainProduct']
        ['name']['hu'];
  }
}
