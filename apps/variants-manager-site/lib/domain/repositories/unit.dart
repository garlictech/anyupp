import '../entities/entities.dart';

abstract class UnitRepository {
  Future<List<Unit>> getUnitList();
  Future<Unit?> getUnit(String id);
}
