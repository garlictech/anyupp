import 'package:anyupp/modules/takeaway/takeaway.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';

// class MockTakeAwayBloc extends Fake implements TakeAwayBloc {
//   final ServingMode servingMode;

//   MockTakeAwayBloc({this.servingMode = ServingMode.inPlace}) : super();

//   TakeAwayState get state => ServingModeSelectedState(servingMode);
//   Future<void> close() async => {};
// }

class MockTakeAwayBloc extends TakeAwayBloc {
  final ServingMode servingMode;

  MockTakeAwayBloc({this.servingMode = ServingMode.inPlace}) : super();

  TakeAwayState get state => ServingModeSelectedState(servingMode);
  Stream<TakeAwayState> get stream =>
      Stream.value(ServingModeSelectedState(servingMode));

  @override
  // ignore: must_call_super
  Future<void> close() async => {};
}
