import 'dart:async';

import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:rxdart/rxdart.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  final IAuthProvider _authProvider;

  AwsFavoritesProvider(this._authProvider);

  StreamController<List<FavoriteProduct>?> _favoritesController = BehaviorSubject<List<FavoriteProduct>>();
  List<FavoriteProduct>? _favorites;

  @override
  Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) async {
    if (_favorites == null) {
      _favorites = await _getFavorites(chainId, unitId);
    }
    bool add = _favorites == null || _favorites?.indexWhere((product) => product.product.id == productId) == -1;
    // Add to favorites
    if (add) {
      await _addFavoriteProduct(chainId, unitId, productId);
    } else {
      // Remove from favorites
      FavoriteProduct? product = await _favorites?.firstWhere((product) => product.product.id == productId);
      if (product != null) {
        await _deleteFavoriteProduct(product.id!);
      }
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

    return _favorites!.indexWhere((product) => product.product.id == productId) >= 0;
  }

  @override
  Stream<List<FavoriteProduct>?> getFavoritesList(String chainId, String unitId) {
    _getFavorites(chainId, unitId).then((favorites) {
      // print('***** getFavoritesList().then()=$favorites');
      _favorites = favorites ?? [];
      _favoritesController.add(_favorites);
    });
    return _favoritesController.stream;
  }

  Future<List<FavoriteProduct>?> _getFavorites(String chainId, String unitId) async {
    print('_getFavorites().unitId=$unitId');
    try {
      User? user = await _authProvider.getAuthenticatedUserProfile();
      if (user == null) {
        throw LoginException(
          code: LoginException.CODE,
          subCode: LoginException.USER_NOT_LOGGED_IN,
          message: 'User not logged in. getAuthenticatedUserProfile() is null',
        );
      }
      var result = await GQL.amplify.execute(ListFavoriteProductsQuery(
          variables: ListFavoriteProductsArguments(
        userId: user.id,
        unitId: unitId,
      )));

      if (result.data == null || result.data?.listFavoriteProducts == null) {
        _favoritesController.add([]);
        return [];
      }

      var items = result.data?.listFavoriteProducts?.items;
      if (items == null || items.isEmpty) {
        _favoritesController.add([]);
        return [];
      }

      List<FavoriteProduct> favorites = [];
      for (int i = 0; i < items.length; i++) {
        favorites.add(FavoriteProduct.fromJson(items[i]!.toJson()));
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
      var result = await GQL.amplify.execute(DeleteFavoriteProductMutation(
          variables: DeleteFavoriteProductArguments(
        favoriteProductId: favoriteProductId,
      )));

      return result.errors == null || (result.errors != null && result.errors!.isEmpty);
    } on Exception catch (e) {
      print('AwsFavoritesProvider._deleteFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  Future<bool> _addFavoriteProduct(String chainId, String unitId, String productId) async {
    print('AwsFavoritesProvider._addFavoriteProduct().unit=$unitId');
    try {
      User? user = await _authProvider.getAuthenticatedUserProfile();
      if (user == null) {
        throw LoginException(
          code: LoginException.CODE,
          subCode: LoginException.USER_NOT_LOGGED_IN,
          message: 'User not logged in. getAuthenticatedUserProfile() is null',
        );
      }
      var result = await GQL.amplify.execute(CreateFavoriteProductMutation(
          variables: CreateFavoriteProductArguments(
        userId: user.id,
        unitId: unitId,
        productId: productId,
      )));

      return result.errors == null || (result.errors != null && result.errors!.isEmpty);
    } on Exception catch (e) {
      print('AwsFavoritesProvider._addFavoriteProduct.Exception: $e');
      rethrow;
    }
  }
}
