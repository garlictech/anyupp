import 'package:anyupp/models/ProductComponent.dart';

abstract class ProductComponentRepository {
  Future<List<ProductComponent>> getProductComponents(String ownerProductId);
}
