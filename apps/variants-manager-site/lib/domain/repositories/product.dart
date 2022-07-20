import '../entities/entities.dart';

abstract class ProductRepository {
  Future<List<Product>> getProductsOfUnit(String unitId);
}
