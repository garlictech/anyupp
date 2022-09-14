import 'package:anyupp/modules/menu/menu.dart';
import 'package:flutter_test/flutter_test.dart';

class MockProductListBloc extends Fake implements ProductListBloc {
  final ProductListState _state;

  MockProductListBloc([this._state = const NoProductListLoaded()]);

  ProductListState get state => _state;
  Stream<ProductListState> get stream => Stream.value(_state);
  Future<void> close() async => {};
  void add(ProductListEvent event) => {};
}
