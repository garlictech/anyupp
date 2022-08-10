import 'package:anyupp/core/core.dart';
import 'package:anyupp/models.dart';

class MockUnitSelectBloc extends UnitSelectBloc {
  final Unit unit;

  MockUnitSelectBloc(this.unit);

  UnitSelectState get state => UnitSelected(unit);
}
