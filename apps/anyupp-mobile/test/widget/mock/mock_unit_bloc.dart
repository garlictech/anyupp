import 'package:fa_prev/core/core.dart';
import 'package:mockito/mockito.dart';

class MockUnitsBloc extends Fake implements UnitsBloc {
  UnitsState get state => UnitsInitial();
  Future<void> close() async => {};
  Stream<UnitsState> get stream => Stream.value(UnitsInitial());
}
