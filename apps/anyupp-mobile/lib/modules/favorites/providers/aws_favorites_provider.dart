import 'dart:async';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  final IAuthProvider _authProvider;

  AwsFavoritesProvider(this._authProvider);

  StreamController<List<FavoriteProduct>> _favoritesController = BehaviorSubject<List<FavoriteProduct>>();
  List<FavoriteProduct> _favorites;

  @override
  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) async {
    if (_favorites == null) {
      _favorites = await _getFavorites(chainId, unitId);
    }
    bool add = _favorites == null || _favorites.indexWhere((product) => product.product.id == productId) == -1;
    // Add to favorites
    if (add) {
      await _addFavoriteProduct(chainId, unitId, productId);
    } else {
      // Remove from favorites
      FavoriteProduct product = await _favorites.firstWhere((product) => product.product.id == productId);
      await _deleteFavoriteProduct(product.id);
    }
    _favorites = await _getFavorites(chainId, unitId);
    return add;
  }

  @override
  Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId) async {
    if (_favorites == null) {
      _favorites = await _getFavorites(chainId, unitId);
    }

    if (_favorites == null) {
      return false;
    }

    return _favorites.indexWhere((product) => product.product.id == productId) >= 0;
  }

  @override
  Stream<List<FavoriteProduct>> getFavoritesList(String chainId, String unitId) {
    _getFavorites(chainId, unitId).then((favorites) {
      // print('***** getFavoritesList().then()=$favorites');
      _favorites = favorites ?? [];
      _favoritesController.add(_favorites);
    });
    return _favoritesController.stream;

    // try {
    //   _favorites = await _getFavorites(chainId, unitId);
    //   yield _favorites;
    //   // _favoritesController.add(_favorites);
    // } on ApiException catch (e) {
    //   print('AwsFavoritesProvider.getFavoritesList.ApiException: $e');
    //   rethrow;
    // } on Exception catch (e) {
    //   print('AwsFavoritesProvider.getFavoritesList.Exception: $e');
    //   rethrow;
    // }
  }

  Future<List<FavoriteProduct>> _getFavorites(String chainId, String unitId) async {
    print('_getFavorites().unitId=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAppSyncGraphQLClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_LIST_FAVORITES),
        variables: {
          'userId': user.id,
          'unitId': unitId,
        },
        fetchPolicy: FetchPolicy.networkOnly,
      ));
      // print('_getFavorites().result.data=${result.data}');
      // print('_getFavorites().result.exception=${result.exception}');

      List<dynamic> items = result.data['listFavoriteProducts']['items'];
      if (items == null || items.isEmpty) {
        _favoritesController.add([]);
        return [];
      }

      List<FavoriteProduct> favorites = [];
      for (int i = 0; i < items.length; i++) {
        favorites.add(FavoriteProduct.fromJson(Map<String, dynamic>.from(items[i])));
      }

      // print('***** getFavoritesList().favorites=$favorites');
      _favoritesController.add(favorites);
      return favorites;
    } on Exception catch (e) {
      print('AwsFavoritesProvider.getFavoritesList.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteFavoriteProduct(String favoriteProductId) async {
    print('_deleteFavoriteProduct().id=$favoriteProductId');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAppSyncGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_DELETE_FAVORITE_PRODUCT),
          variables: {
            'favoriteProductId': favoriteProductId,
          },
        ),
      );

      // var operation = Amplify.API.mutate(
      //   request: GraphQLRequest<String>(
      //     document: MUTATION_DELETE_FAVORITE_PRODUCT,
      //     variables: {
      //       'favoriteProductId': favoriteProductId,
      //     },
      //   ),
      // );

      // var response = await operation.response;
      // var data = response.data;
      // Map<String, dynamic> json = jsonDecode(data);
      // print('_deleteFavoriteProduct().response=$json');
      // // TODO AWS ERROR HANDLING?
      // return response.errors?.isEmpty ?? true;

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsFavoritesProvider._deleteFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _addFavoriteProduct(String chainId, String unitId, String productId) async {
    print('AwsFavoritesProvider._addFavoriteProduct().unit=$unitId');
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAppSyncGraphQLClient();
      QueryResult result = await _client.value.mutate(
        MutationOptions(
          document: gql(MUTATION_ADD_FAVORITE_PRODUCT),
          variables: {
            'userId': user.id,
            'unitId': unitId,
            'productId': productId,
          },
        ),
      );
      print('AwsFavoritesProvider._addFavoriteProduct().result.data=${result.data}');
      if (result.hasException) {
        print('AwsFavoritesProvider._addFavoriteProduct().exception=${result.exception}');
        print('AwsFavoritesProvider._addFavoriteProduct().source=${result.source}');
      }

      return result?.exception == null ? true : false;
    } on Exception catch (e) {
      print('AwsFavoritesProvider._addFavoriteProduct.Exception: $e');
      rethrow;
    }
  }
}
