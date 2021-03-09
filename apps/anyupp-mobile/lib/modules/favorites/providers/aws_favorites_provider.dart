import 'dart:async';
import 'dart:convert';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/graphql/graphql-queries.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:rxdart/rxdart.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  final IAuthProvider _authProvider;

  AwsFavoritesProvider(this._authProvider);

  // StreamController<List<GeneratedProduct>> _favoritesController = BehaviorSubject<List<GeneratedProduct>>();
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
      FavoriteProduct product = _favorites.firstWhere((product) => product.product.id == productId);
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
  Stream<List<FavoriteProduct>> getFavoritesList(String chainId, String unitId) async* {
    try {
      _favorites = await _getFavorites(chainId, unitId);
      yield _favorites;
    } on ApiException catch (e) {
      print('AwsFavoritesProvider.getFavoritesList.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('AwsFavoritesProvider.getFavoritesList.Exception: $e');
      rethrow;
    }
  }

  Future<List<FavoriteProduct>> _getFavorites(String chainId, String unitId) async {
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: QUERY_LIST_FAVORITES,
          variables: {'userId': user.id, 'unitId': unitId},
        ),
      );

      var response = await operation.response;
      var data = response.data;
      // print('***** getFavoritesList().data=$data');
      Map<String, dynamic> json = jsonDecode(data);

      List<dynamic> items = json['listFavoriteProducts']['items'];
      if (items == null || items.isEmpty) {
        return null;
      }

      List<FavoriteProduct> favorites = [];
      for (int i = 0; i < items.length; i++) {
        favorites.add(FavoriteProduct.fromJson(Map<String, dynamic>.from(items[i])));
      }

      print('***** getFavoritesList().favorites=$favorites');
      return favorites;
    } on ApiException catch (e) {
      print('AwsFavoritesProvider.getFavoritesList.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('AwsFavoritesProvider.getFavoritesList.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _deleteFavoriteProduct(String favoriteProductId) async {
    print('_deleteFavoriteProduct().id=$favoriteProductId');
    try {
      var operation = Amplify.API.mutate(
        request: GraphQLRequest<String>(
          document: MUTATION_DELETE_FAVORITE_PRODUCT,
          variables: {
            'favoriteProductId': favoriteProductId,
          },
        ),
      );

      var response = await operation.response;
      var data = response.data;
      Map<String, dynamic> json = jsonDecode(data);
      print('_deleteFavoriteProduct().response=$json');
      // TODO AWS ERROR HANDLING?
      return response.errors?.isEmpty ?? true;

    } on ApiException catch (e) {
      print('AwsFavoritesProvider._deleteFavoriteProduct.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('AwsFavoritesProvider._deleteFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _addFavoriteProduct(String chainId, String unitId, String productId) async {
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      var operation = Amplify.API.mutate(
        request: GraphQLRequest<String>(
          document: MUTATION_ADD_FAVORITE_PRODUCT,
          variables: {
            'userId': user.id,
            'chainId': chainId,
            'unitId': unitId,
            'productId': productId
          },
        ),
      );

      var response = await operation.response;
      var data = response.data;
      Map<String, dynamic> json = jsonDecode(data);
      print('_addFavoriteProduct().response=$json');
      return response.errors?.isEmpty ?? true;

    } on ApiException catch (e) {
      print('AwsFavoritesProvider._addFavoriteProduct.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('AwsFavoritesProvider._addFavoriteProduct.Exception: $e');
      rethrow;
    }
  }
}
