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
        'hu': 'Normál hamburger',
        'en': 'Normál hamburger',
        'de': 'Normál hamburger',
      },
      'description': 'Normál hamburger verzió',
      'position': 0,
      'type': 'product_modifier',
      'maxSelection': 0,
      'items': [
        {
          'productComponentId': 'Modifier1#productComponentId#1',
          'price': 0.0,
          'position': 1,
          'name': {
            'hu': 'Marhahúspogácsa',
            'en': 'Marhahúspogácsa',
            'de': 'Marhahúspogácsa',
          },
          'description': '20 dkg Marhahúspogácsa',
        },
         {
          'productComponentId': 'Modifier1#productComponentId#2',
          'price': 0.0,
          'position': 2,
          'name': {
            'hu': 'Hamburger buci',
            'en': 'Hamburger buci',
            'de': 'Hamburger buci',
          },
          'description': 'Klasszikus hamburger buci hazai lisztből',
          'allergens': ['gluten']
        },
        {
          'productComponentId': 'Modifier1#productComponentId#3',
          'price': 0.0,
          'position': 3,
          'name': {
            'hu': 'Vegyes csalamádé saláta',
            'en': 'Vegyes csalamádé saláta',
            'de': 'Vegyes csalamádé saláta',
          },
          'description': 'Vegyes csalamádé saláta',
          'allergens': ['celery']
        },
        {
          'productComponentId': 'Modifier1#productComponentId#4',
          'price': 0.0,
          'position': 4,
          'name': {
            'hu': 'Mustár, ketchup, majonéz',
            'en': 'Mustár, ketchup, majonéz',
            'de': 'Mustár, ketchup, majonéz',
          },
          'description': 'Mustár, ketchup, majonéz',
          'allergens': ['egg', 'mustard']
        }
     ]
    },
    {
      'productSetId': 'modifier#2',
      'name': {
        'hu': 'Vegetariánus',
        'en': 'Vegetariánus',
        'de': 'Vegetariánus',
      },
      'description': 'Vegetáriánus verzió',
      'position': 1,
      'type': 'product_modifier',
      'maxSelection': 3,
      'items': [
        {
          'productComponentId': 'Modifier2#productComponentId#1',
          'price': 250.0,
          'position': 1,
          'name': {
            'hu': 'Vega húspogácsa',
            'en': 'Vega húspogácsa',
            'de': 'Vega húspogácsa',
          },
          'description': 'Húsmentes, de húsízű pogácsa',
          'allergens': ['egg', 'peanut'],
        },
         {
          'productComponentId': 'Modifier2#productComponentId#2',
          'price': 100.0,
          'position': 2,
          'name': {
            'hu': 'Rozsos buci',
            'en': 'Rozsos buci',
            'de': 'Rozsos buci',
          },
          'description': 'Rozsos buci egészséges lisztből',
        }
     ]
    },
    {
      'productSetId': 'modifier#3',
      'name': {
        'hu': 'Extra húsos',
        'en': 'Extra húsos',
        'de': 'Extra húsos',
      },
      'description': 'Extra húsos verzió',
      'position': 2,
      'type': 'product_modifier',
      'maxSelection': 2,
      'items': [
        {
          'productComponentId': 'Modifier3#productComponentId#1',
          'price': 300.0,
          'position': 1,
          'name': {
            'hu': 'Dupla húspogácsa',
            'en': 'Dupla húspogácsa',
            'de': 'Dupla húspogácsa',
          },
          'description': 'Dupla húspogácsa',
          'allergens': ['egg'],
        },
         
     ]
    },
    {
      'productSetId': 'modifier#4',
      'name': {
        'hu': 'Csirkemelles',
        'en': 'Csirkemelles',
        'de': 'Csirkemelles',
      },
      'description': 'Csirkemelles verzió',
      'position': 3,
      'type': 'product_modifier',
      'maxSelection': 2,
      'items': [
        {
          'productComponentId': 'Modifier4#productComponentId#1',
          'price': 300.0,
          'position': 1,
          'name': {
            'hu': 'Csirkemell húspogácsa',
            'en': 'Csirkemell húspogácsa',
            'de': 'Csirkemell húspogácsa',
          },
          'description': 'Csirkemell húspogácsa',
          'allergens': ['egg'],
        },
         
     ]
    },

    // EXTRAS
    {
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
          'price': 85.0,
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
          'price': 50.0,
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
          'price': 250.0,
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
          'price': 250.0,
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
          'price': 150.0,
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
