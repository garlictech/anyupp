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
          searchUnitProducts(filter: {
            unitId: {eq: "$unitId"}
            and: { deletedAt: { exists: false } }
          }) {
          items {
            id
            name {
              hu
            }
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

    return items.map<Product>((item) => Product.fromJson(item)).toList();
  }
}
