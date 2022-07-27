import '/core/core.dart';
import '/models.dart';

class MockUnitSelectBloc extends UnitSelectBloc {
  final GeoUnit unit;

  MockUnitSelectBloc(this.unit);

  UnitSelectState get state => UnitSelected(unit);
}
