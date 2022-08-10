import 'package:anyupp/models.dart';
import 'package:anyupp/modules/payment/payment.dart';
import 'package:flutter_test/flutter_test.dart';

import 'mocks.dart';

class MockPaymentRepository extends Fake implements StripePaymentRepository {
  Future<List<StripePaymentMethod>> getPaymentMethods() async {
    return [];
  }
}

class MockStripePaymentBloc extends StripePaymentBloc {
  final StripePaymentState? initialState;

  MockStripePaymentBloc({this.initialState})
      : super(MockPaymentRepository(), MockCartRepository(null)) {
    on((event, emit) {
      emit(StripePaymentLoading());
      emit(StripePaymentMethodsList(null));
    });
  }

  StripePaymentState get state => initialState ?? StripePaymentInitialState();
  Stream<StripePaymentState> get stream => Stream.value(
        initialState ?? StripePaymentInitialState(),
      );
}
