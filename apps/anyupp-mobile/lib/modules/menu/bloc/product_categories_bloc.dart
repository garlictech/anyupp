import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';

part 'product_categories_event.dart';
part 'product_categories_state.dart';

class ProductCategoriesBloc extends Bloc<ProductCategoriesEvent, ProductCategoriesState> {
  final UnitSelectBloc _unitSelectBloc;
  final ProductRepository _productRepository;

  List<ProductCategory>? _categories;

  late StreamSubscription _unitSelectSubscription;

  ProductCategoriesBloc(this._unitSelectBloc, this._productRepository) : super(ProductCategoriesLoading()) {
    if (_unitSelectBloc.state is UnitSelected) {
      add(LoadProductCategories(
        (_unitSelectBloc.state as UnitSelected).unit.id,
      ));
    }
    _unitSelectSubscription = _unitSelectBloc.stream.asBroadcastStream().listen((state) {
      if (state is UnitSelected) {
        add(LoadProductCategories(state.unit.id));
      }
    });
  }

  @override
  Stream<ProductCategoriesState> mapEventToState(
    ProductCategoriesEvent event,
  ) async* {
    if (event is LoadProductCategories) {
      yield ProductCategoriesLoading();
      var response = await _productRepository.getProductCategoryList(event.unitId);
      _categories = response.data;
      yield ProductCategoriesLoaded(_categories);
    }
  }

  @override
  Future<void> close() async {
    await _unitSelectSubscription.cancel();
    return super.close();
  }
}
