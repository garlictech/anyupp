import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/models.dart';
import 'package:flutter/foundation.dart';
import 'package:meta/meta.dart';

// TODO ezt a trukkot at kellene tenni a tobbi blocba is
part 'product_categories_event.dart';
part 'product_categories_state.dart';

class ProductCategoriesBloc extends Bloc<ProductCategoriesEvent, ProductCategoriesState> {
  final UnitSelectBloc _unitSelectBloc;
  final ProductRepository _productRepository;

  StreamSubscription _unitSelectSubscription;
  StreamSubscription _productCategoriesSubscription;

  ProductCategoriesBloc(this._unitSelectBloc, this._productRepository) : super(ProductCategoriesLoading()) {
    if (_unitSelectBloc.state is UnitSelected) {
      add(LoadProductCategories(
        (_unitSelectBloc.state as UnitSelected).unit.chainId,
        (_unitSelectBloc.state as UnitSelected).unit.unitId,
      ));
    }
    _unitSelectSubscription = _unitSelectBloc.listen((state) {
      if (state is UnitSelected) {
        add(LoadProductCategories(state.unit.chainId, state.unit.unitId));
      }
    });
  }

  @override
  Stream<ProductCategoriesState> mapEventToState(
    ProductCategoriesEvent event,
  ) async* {
    if (event is LoadProductCategories) {
      yield* _mapLoadProductCategoriesToState(event);
    }
    if (event is ProductCategoriesUpdated) {
      yield ProductCategoriesLoaded(event.productCategories);
    }
  }

  @override
  Future<void> close() async {
    await _unitSelectSubscription?.cancel();
    return super.close();
  }

  Stream<ProductCategoriesState> _mapLoadProductCategoriesToState(LoadProductCategories event) async* {
    yield ProductCategoriesLoading();
    await _productCategoriesSubscription?.cancel();
    _productCategoriesSubscription =
        _productRepository.getProductCategoryList(event.chainId, event.unitId).listen((event) {
      add(ProductCategoriesUpdated(event));
    });
  }
}
