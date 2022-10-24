import '/models.dart';

abstract class UnitRepository {
  Future<Unit> getUnit(String unitId);
}
