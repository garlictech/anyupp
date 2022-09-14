import 'package:functional_data/functional_data.dart';

part 'product_variant_manager_viewmodel.g.dart';

@FunctionalData()
class ProductVariantManagerViewModel extends $ProductVariantManagerViewModel {
  @override
  final bool working;

  ProductVariantManagerViewModel({this.working = false});
}
