import 'package:fa_prev/modules/payment/payment.dart';
import 'package:flutter_test/flutter_test.dart';

import 'mocks.dart';

class MockPaymentRepository extends Fake implements StripePaymentRepository {}

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
