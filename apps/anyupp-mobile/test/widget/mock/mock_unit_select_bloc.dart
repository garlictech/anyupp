import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';

class MockUnitSelectBloc extends UnitSelectBloc {
  final GeoUnit unit;

  MockUnitSelectBloc(this.unit);

  UnitSelectState get state => UnitSelected(unit);
}
