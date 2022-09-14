import '../../data/providers.dart';
import '../../domain/entities/entities.dart';
import '../../domain/states/product_list.dart';
import '../viewmodels/product_variant_manager_viewmodel.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductVariantManagerScreenPresenter
    extends StateNotifier<ProductVariantManagerViewModel> {
  final Ref ref;
  final String unitId;

  ProductVariantManagerScreenPresenter(this.ref, this.unitId)
      : super(ProductVariantManagerViewModel());

  onDragAccept(Product newOwner, Variant variant) async {
    state = state.copyWith(working: true);
    final variantRepository = ref.read(variantRepositoryProvider);
    await variantRepository.setNewOwnerProduct(newOwner, variant);
    await Future.delayed(const Duration(seconds: 3));
    final productList = ref.read(productListProvider(unitId).notifier);
    productList.refresh();
    state = state.copyWith(working: false);
  }
}

final productVariantManagerMVPProvider = StateNotifierProvider.autoDispose
    .family<ProductVariantManagerScreenPresenter,
        ProductVariantManagerViewModel, String>((ref, unitId) {
  return ProductVariantManagerScreenPresenter(ref, unitId);
});
