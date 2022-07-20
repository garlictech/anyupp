import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/exception.dart';

part 'product_list_event.dart';
part 'product_list_state.dart';

class ProductListBloc extends Bloc<ProductListEvent, ProductListState> {
  final ProductRepository _productRepository;
  final FavoritesRepository _favoritesRepository;

  ProductListBloc(this._productRepository, this._favoritesRepository)
      : super(NoProductListLoaded()) {
    on<LoadAllProductList>(_onLoadAllProductList);
    on<RefreshFavoritesInProductList>(_onRefreshFavoritesInProductList);
  }

  List<GeneratedProduct>? _products;
  List<ProductCategory>? _categories;
  List<FavoriteProduct>? _favorites;

  FutureOr<void> _onLoadAllProductList(
      LoadAllProductList event, Emitter<ProductListState> emit) async {
    try {
      log.d('********* ProductListBloc.LoadAllProductList()');
      emit(ProductListLoading());
      // Load favorites
      var favorites = await _favoritesRepository.getFavoritesList(event.unitId);

      // Load categories
      var categories =
          await _productRepository.getProductCategoryList(event.chainId);

      // Load products
      var products = await _productRepository.getAllProductList(
        unitId: event.unitId,
        chainId: event.chainId,
        nextToken: event.nextToken,
      );

      log.d('********* ProductListBloc.categories=${categories.data?.length}');
      log.d('********* ProductListBloc.products=${products.data?.length}');
      log.d('********* ProductListBloc.favorites=${favorites.data?.length}');

      _products = products.data;
      _categories = categories.data;
      _favorites = favorites.data;

      emit(ProductListLoaded(
        products: _products ?? [],
        productCategories: _categories,
        favorites: _favorites,
      ));
    } on GraphQLException catch (e) {
      log.e(
          '********* ProductListBloc.LoadAllProductList.PlatformException()=$e');
      getIt<ExceptionBloc>().add(ShowException(e));
    } on Exception catch (e) {
      log.e('********* ProductListBloc.LoadAllProductList.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(ProductException.fromException(
        ProductException.ERROR_LOADING_PRODUCT_CATEGORIES,
        e,
      )));
    }
  }

  FutureOr<void> _onRefreshFavoritesInProductList(
    RefreshFavoritesInProductList event,
    Emitter<ProductListState> emit,
  ) {
    _favorites = event.favorites;
    emit(ProductListLoaded(
      products: _products ?? [],
      productCategories: _categories,
      favorites: _favorites,
    ));
  }
}
