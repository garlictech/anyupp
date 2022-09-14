import '../entities/entities.dart';

abstract class VariantRepository {
  Future<bool> setNewOwnerProduct(Product newOwner, Variant variant);
}
