import 'package:fa_prev/shared/exception.dart';
import 'package:flutter_test/flutter_test.dart';

class MockExceptionBloc extends Fake implements ExceptionBloc {
  ExceptionState get state => NoException();
  void add(ExceptionEvent event) => {};
  Stream<ExceptionState> get stream => Stream.value(NoException());
  Future<void> close() async => {};
}
