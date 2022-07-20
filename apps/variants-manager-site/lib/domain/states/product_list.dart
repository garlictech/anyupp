import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/providers.dart';
import '../entities/entities.dart';
import '../repositories/product.dart';

class ProductListState {
  final bool working;
  final List<Product> products;

  ProductListState({this.working = false, this.products = const []});
}

class ProductListProvider extends StateNotifier<ProductListState> {
  final ProductRepository productRepository;
  final String unitId;

  ProductListProvider(this.productRepository, this.unitId)
      : super(ProductListState()) {
    refresh();
  }

  refresh() async {
    state = ProductListState(working: true, products: state.products);
    final products = await productRepository.getProductsOfUnit(unitId);
    state = ProductListState(working: false, products: products);
  }
}

final productListProvider = StateNotifierProvider.autoDispose
    .family<ProductListProvider, ProductListState, String>((ref, unitId) {
  final productRepository = ref.watch(productRepositoryProvider);
  return ProductListProvider(productRepository, unitId);
});
