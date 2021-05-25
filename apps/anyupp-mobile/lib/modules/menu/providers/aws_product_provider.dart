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
      throw result.exception;
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
          json['configSets'] = generateDummyConfigSets();
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

List<Map<String, dynamic>> generateDummyConfigSets() {
  return [
    {
      'productSetId': 'modifier#1',
      'name': {
        'hu': 'Hamburgerhús',
        'en': 'Hamburgerhús',
        'de': 'Hamburgerhús',
      },
      'position': 0,
      'type': 'product_modifier',
      'maxSelection': 0,
      'items': [
        {
          'productComponentId': 'Modifier1#productComponentId#1',
          'price': 0.0,
          'position': 1,
          'name': {
            'hu': 'Marhahúspogácsa (alap)',
            'en': 'Marhahúspogácsa (alap)',
            'de': 'Marhahúspogácsa (alap)',
          },
          'description': '20 dkg Marhahúspogácsa',
        },
        {
          'productComponentId': 'Modifier1#productComponentId#2',
          'price': 150.0,
          'position': 2,
          'name': {
            'hu': 'Lávaköves csirkemell',
            'en': 'Lávaköves csirkemell',
            'de': 'Lávaköves csirkemell',
          },
          'allergens': ['gluten']
        },
        {
          'productComponentId': 'Modifier1#productComponentId#3',
          'price': 100.0,
          'position': 3,
          'name': {
            'hu': 'Vegetáriánus pogácsa',
            'en': 'Vegetáriánus pogácsa',
            'de': 'Vegetáriánus pogácsa',
          },
          'allergens': ['celery']
        },
      ]
    },
    {
      'productSetId': 'modifier#2',
      'name': {
        'hu': 'Buci',
        'en': 'Buci',
        'de': 'Buci',
      },
      'position': 1,
      'type': 'product_modifier',
      'maxSelection': 3,
      'items': [
        {
          'productComponentId': 'Modifier2#productComponentId#1',
          'price': 0.0,
          'position': 1,
          'name': {
            'hu': 'Hamburger buci (alap)',
            'en': 'Hamburger buci (alap)',
            'de': 'Hamburger buci (alap)',
          },
          'allergens': ['egg', 'peanut'],
        },
        {
          'productComponentId': 'Modifier2#productComponentId#2',
          'price': 50.0,
          'position': 2,
          'name': {
            'hu': 'Rozsos buci',
            'en': 'Rozsos buci',
            'de': 'Rozsos buci',
          },
          'description': 'Rozsos buci egészséges lisztből',
        },
        {
          'productComponentId': 'Modifier2#productComponentId#3',
          'price': 0.0,
          'position': 3,
          'name': {
            'hu': 'Gluténmentes buci',
            'en': 'Gluténmentes buci',
            'de': 'Gluténmentes buci',
          },
        }
      ]
    },
    {
      'productSetId': 'modifier#3',
      'name': {
        'hu': 'Saláta',
        'en': 'Saláta',
        'de': 'Saláta',
      },
      'position': 2,
      'type': 'product_modifier',
      'maxSelection': 2,
      'items': [
        {
          'productComponentId': 'Modifier3#productComponentId#1',
          'price': 0.0,
          'position': 1,
          'name': {
            'hu': 'Vegyes zöldsaláta',
            'en': 'Vegyes zöldsaláta',
            'de': 'Vegyes zöldsaláta',
          },
        },
        {
          'productComponentId': 'Modifier3#productComponentId#2',
          'price': 75.0,
          'position': 2,
          'name': {
            'hu': 'Csalamádé',
            'en': 'Csalamádé',
            'de': 'Csalamádé',
          },
        },
        {
          'productComponentId': 'Modifier3#productComponentId#3',
          'price': 50.0,
          'position': 3,
          'name': {
            'hu': 'Káposztasaláta',
            'en': 'Káposztasaláta',
            'de': 'Káposztasaláta',
          },
        },
      ]
    },
    
    // EXTRAS
    {
      'productSetId': 'extra#1',
      'name': {
        'hu': 'Feltétek',
        'en': 'Feltétek',
        'de': 'Feltétek',
      },
      'description': 'Extra feltétek',
      'position': 1,
      'type': 'product_extras',
      'maxSelection': 2,
      'items': [
        {
          'productComponentId': 'Extra1#productComponentId#1',
          'price': 100.0,
          'position': 1,
          'name': {
            'hu': 'Extra sajt',
            'en': 'Extra sajt',
            'de': 'Extra sajt',
          },
          'description': 'Extra sajt',
          'allergens': ['milk'],
        },
        {
          'productComponentId': 'Extra1#productComponentId#2',
          'price': 150.0,
          'position': 2,
          'name': {
            'hu': 'Extra vargányagomba',
            'en': 'Extra vargányagomba',
            'de': 'Extra vargányagomba',
          },
          'description': 'Extra vargányagomba',
        },
        {
          'productComponentId': 'Extra1#productComponentId#3',
          'price': 50.0,
          'position': 3,
          'name': {
            'hu': 'Plusz ketchup',
            'en': 'Plusz ketchup',
            'de': 'Plusz ketchup',
          },
          'description': 'Plusz ketchup',
          'allergens': ['gluten'],
        },
      ]
    },

    {
      'productSetId': 'extra#2',
      'name': {
        'hu': 'Kiegészítők',
        'en': 'Kiegészítők',
        'de': 'Kiegészítők',
      },
      'description': 'Kiegészítők',
      'position': 2,
      'type': 'product_extras',
      'maxSelection': 2,
      'items': [
        {
          'productComponentId': 'Extra2#productComponentId#1',
          'price': 350.0,
          'position': 1,
          'name': {
            'hu': 'Sültkrumpli',
            'en': 'Sültkrumpli',
            'de': 'Sültkrumpli',
          },
          'description': 'Sültkrumpli',
          'allergens': ['gluten'],
        },
        {
          'productComponentId': 'Extra2#productComponentId#2',
          'price': 180.0,
          'position': 2,
          'name': {
            'hu': 'Rostos őszibarack 2dl',
            'en': 'Rostos őszibarack 2dl',
            'de': 'Rostos őszibarack 2dl',
          },
          'description': 'Rostos őszibarack 2dl',
        },
      ]
    },
  ];
}
