import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

part 'product_list_event.dart';
part 'product_list_state.dart';

class ProductListBloc extends Bloc<ProductListEvent, ProductListState> {
  final ProductRepository _productRepository;

  ProductListBloc(this._productRepository) : super(NoProductListLoaded()) {
    on<LoadProductList>(_onLoadProductList);
  }

  FutureOr<void> _onLoadProductList(
      LoadProductList event, Emitter<ProductListState> emit) async {
    try {
      log.d('********* ProductListBloc.LoadProductList()');
      emit(ProductListLoading());
      var response = await _productRepository.getProductList(
        event.unitId,
        event.categoryId,
        event.nextToken,
      );
      emit(ProductListLoaded(response));
    } on GraphQLException catch (e) {
      log.e('********* ProductListBloc.PlatformException()=$e');
      getIt<ExceptionBloc>().add(ShowException(e));
    } on Exception catch (e) {
      log.e('********* ProductListBloc.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(ProductException.fromException(
        ProductException.ERROR_LOADING_PRODUCT_CATEGORIES,
        e,
      )));
    }
  }
}
