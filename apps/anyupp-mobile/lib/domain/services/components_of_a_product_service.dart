import 'package:anyupp/providers/providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/models/ProductComponent.dart';

Future<List<ProductComponent>> configComponentsOfAProduct(
    Ref ref, String productId) async {
  final productComponentRepository = ref.read(productComponentRepositoryProvider);
  final product = await ref.watch(productProvider(productId).future);
  return productComponentRepository.getProductComponents(product.id);
}
