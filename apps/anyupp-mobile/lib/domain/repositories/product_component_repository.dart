import 'package:anyupp/models/ProductComponent.dart';
import 'package:anyupp/models/ProductComponentSet.dart';

abstract class ProductComponentRepository {
  Future<List<ProductComponent>> getProductComponents(String ownerProductId);
  Future<ProductComponentSet> getProductComponentSet(String id);
  Future<ProductComponent> getProductComponent(String id);
}
