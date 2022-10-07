import 'dart:async';

import 'package:anyupp/domain/repositories/repositories.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/core/units/units.dart';
import '/models.dart';

part 'product_categories_event.dart';
part 'product_categories_state.dart';

class ProductCategoriesBloc
    extends Bloc<ProductCategoriesEvent, ProductCategoriesState> {
  final UnitSelectBloc _unitSelectBloc;
  final ProductRepository _productRepository;

  List<ProductCategory>? _categories;

  late StreamSubscription _unitSelectSubscription;

  ProductCategoriesBloc(this._unitSelectBloc, this._productRepository)
      : super(ProductCategoriesLoading()) {
    on<LoadProductCategories>(_onLoadProductCategories);
    if (_unitSelectBloc.state is UnitSelected) {
      add(LoadProductCategories(
        (_unitSelectBloc.state as UnitSelected).unit.id,
      ));
    }
    _unitSelectSubscription =
        _unitSelectBloc.stream.asBroadcastStream().listen((state) {
      if (state is UnitSelected) {
        add(LoadProductCategories(state.unit.id));
      }
    });
  }

  @override
  Future<void> close() async {
    await _unitSelectSubscription.cancel();
    return super.close();
  }

  FutureOr<void> _onLoadProductCategories(
      LoadProductCategories event, Emitter<ProductCategoriesState> emit) async {
    emit(ProductCategoriesLoading());
    var response =
        await _productRepository.getProductCategoryList(event.chainId);
    _categories = response.data;
    emit(ProductCategoriesLoaded(_categories));
  }
}
