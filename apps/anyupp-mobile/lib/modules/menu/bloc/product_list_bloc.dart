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

  ProductListBloc(this._productRepository) : super(NoProductListLoaded());

  @override
  Stream<ProductListState> mapEventToState(ProductListEvent event) async* {
    try {
      if (event is LoadProductList) {
        print('********* ProductListBloc.LoadProductList()');
        yield ProductListLoading();
        var response = await _productRepository.getProductList(
          event.unitId,
          event.categoryId,
          event.nextToken,
        );
        yield ProductListLoaded(response);
      }
    } on GraphQLException catch (e) {
      print('********* ProductListBloc.PlatformException()=$e');
      getIt<ExceptionBloc>().add(ShowException(e));
    } on Exception catch (e) {
      print('********* ProductListBloc.Exception()=$e');
      getIt<ExceptionBloc>().add(ShowException(ProductException.fromException(
        ProductException.ERROR_LOADING_PRODUCT_CATEGORIES,
        e,
      )));
    }
  }
}
