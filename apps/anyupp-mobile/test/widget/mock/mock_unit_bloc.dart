import 'package:fa_prev/core/core.dart';
import 'package:mockito/mockito.dart';

class MockUnitsBloc extends Fake implements UnitsBloc {
  final UnitsState _state;

  MockUnitsBloc(this._state);

  UnitsState get state => _state;
  Future<void> close() async => {};
  Stream<UnitsState> get stream => Stream.value(_state);
  void add(UnitsEvent event) => {};
}
