import 'package:fa_prev/modules/payment/payment.dart';
import 'package:flutter_test/flutter_test.dart';

class MockStripePaymentBloc extends Fake implements StripePaymentBloc {
  StripePaymentState get state => StripePaymentInitialState();
  Future<void> close() async => {};
  Stream<StripePaymentState> get stream =>
      Stream.value(StripePaymentInitialState());
}
