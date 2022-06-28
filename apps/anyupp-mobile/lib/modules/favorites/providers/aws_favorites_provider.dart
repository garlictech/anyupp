import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import 'favorites_provider_interface.dart';

class AwsFavoritesProvider implements IFavoritesProvider {
  final IAuthProvider _authProvider;

  AwsFavoritesProvider(this._authProvider);

  List<FavoriteProduct>? _favorites;

  List<FavoriteProduct>? get favorites => _favorites;

  @override
  Future<bool> addOrRemoveFavoriteProduct(
      String unitId, String categoryId, String productId) async {
    List<FavoriteProduct> temp =
        _favorites != null ? List<FavoriteProduct>.from(_favorites!) : [];

    bool add =
        temp.indexWhere((product) => product.product.id == productId) == -1;

    if (add) {
      FavoriteProduct? added = await _addFavoriteProduct(unitId, productId);

      if (added == null) {
        log.w('addOrRemoveFavoriteProduct.add failed');
        return add;
      }

      temp.add(added);
    } else {
      int? index =
          temp.indexWhere((product) => product.product.id == productId);
      if (index >= 0) {
        bool success = await _deleteFavoriteProduct(temp[index].id!);
        if (success) {
          temp.removeAt(index);
        }
      }
    }

    _favorites = temp.isNotEmpty ? List<FavoriteProduct>.from(temp) : null;
    return add;
  }

  @override
  Future<bool> checkIfProductIsFavorite(String unitId, String productId) async {
    if (_favorites == null) {
      _favorites = (await getFavoritesList(unitId)).data;
    }

    if (_favorites == null) {
      return false;
    }

    return _favorites!
            .indexWhere((product) => product.product.id == productId) >=
        0;
  }

  @override
  Future<PageResponse<FavoriteProduct>> getFavoritesList(String unitId,
      [String? nextToken]) async {
    log.d('_getFavorites().unitId=$unitId');
    try {
      User? user = await _authProvider.getAuthenticatedUserProfile();
      if (user == null) {
        throw LoginException(
          code: LoginException.CODE,
          subCode: LoginException.USER_NOT_LOGGED_IN,
          message: 'User not logged in. getAuthenticatedUserProfile() is null',
        );
      }

      List<FavoriteProduct> temp = [];
      PageResponse<FavoriteProduct>? response;
      var _token = nextToken;

      // load all favorites with pagination
      do {
        response = await _getNextPage(user.id, unitId, _token);
        if (response.data != null) {
          temp.addAll(response.data!);
        }
        _token = response.nextToken;
      } while (response.nextToken != null);

      _favorites = temp.isNotEmpty ? List<FavoriteProduct>.from(temp) : [];

      return PageResponse(
        data: _favorites,
        totalCount: _favorites!.length,
        nextToken: null,
      );
    } on Exception catch (e) {
      log.e('AwsFavoritesProvider.getFavoritesList.Exception: $e');
      return PageResponse(
        data: [],
        totalCount: 0,
        nextToken: null,
      );
    }
  }

  Future<PageResponse<FavoriteProduct>> _getNextPage(
      String userId, String unitId, String? nextToken) async {
    log.d(
        'AwsFavoritesProvider.getFavoritesList().userId=$userId, unitId=$unitId, nextToken=$nextToken');
    var result = await GQL.amplify.execute(
      ListFavoriteProductsQuery(
        variables: ListFavoriteProductsArguments(
          userId: userId,
          unitId: unitId,
          nextToken: nextToken,
        ),
      ),
      fetchPolicy: FetchPolicy.networkOnly,
    );
    log.i(
        'AwsFavoritesProvider.getFavoritesList()=${result.data?.searchFavoriteProducts?.items.length}');

    if (result.hasErrors) {
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
    }

    var items = result.data?.searchFavoriteProducts?.items;
    if (items == null || items.isEmpty) {
      return PageResponse(data: []);
    }

    int count = result.data?.searchFavoriteProducts?.total ?? 0;
    String? token = result.data?.searchFavoriteProducts?.nextToken;

    List<FavoriteProduct> favorites = [];
    for (int i = 0; i < items.length; i++) {
      favorites.add(FavoriteProduct.fromJson(items[i]!.toJson()));
    }
    log.d('***** getFavoritesList().favorites=${favorites.length}');
    return PageResponse(
      data: favorites,
      totalCount: count,
      nextToken: token,
    );
  }

  Future<bool> _deleteFavoriteProduct(String favoriteProductId) async {
    log.d('_deleteFavoriteProduct().id=$favoriteProductId');
    try {
      var result = await GQL.amplify.execute(DeleteFavoriteProductMutation(
          variables: DeleteFavoriteProductArguments(
        favoriteProductId: favoriteProductId,
      )));

      return result.errors == null ||
          (result.errors != null && result.errors!.isEmpty);
    } on Exception catch (e) {
      log.e('AwsFavoritesProvider._deleteFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  Future<FavoriteProduct?> _addFavoriteProduct(
      String unitId, String productId) async {
    log.d('AwsFavoritesProvider._addFavoriteProduct().unit=$unitId');
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

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      if (result.data?.createFavoriteProduct == null) {
        return null;
      }

      return FavoriteProduct.fromJson(
          result.data!.createFavoriteProduct!.toJson());
    } on Exception catch (e) {
      log.e('AwsFavoritesProvider._addFavoriteProduct.Exception: $e');
      rethrow;
    }
  }

  @override
  void resetFavoritesList() {
    _favorites = null;
  }
}
