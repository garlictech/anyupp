import 'package:anyupp/graphql/generated/crud-api.graphql.dart';

import '../Product.dart';

extension ProductExtension on Product {
  //
  bool get isSoldOut => soldOut == true || isAllVariantsSoldOut;

  // No variants found with soldOut = false means: all variants are sold out
  bool get isAllVariantsSoldOut =>
      variants.items.indexWhere((variant) => variant.soldOut == false) == -1;

  bool isAvailableInServingMode(ServingMode? mode) {
    return mode != null && supportedServingModes.contains(mode);
  }
}
