import '/models.dart';

extension ProductExtension on GeneratedProduct {
  //
  bool get isSoldOut => soldOut == true || isAllVariantsSoldOut;

  // No variants found with soldOut = false means: all variants are sold out
  bool get isAllVariantsSoldOut =>
      variants.indexWhere((variant) => variant.soldOut == false) == -1;
}
