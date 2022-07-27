import '/models.dart';
import '/modules/cart/cart.dart';

import 'mocks.dart';

class MockCartBloc extends CartBloc {
  final Cart? cart;
  final BaseCartState? stateToSend;

  MockCartBloc({this.cart, this.stateToSend})
      : super(
          MockCartRepository(cart),
          MockOrderRepository(),
          MockTakeAwayBloc(),
        ) {
    on((event, emit) => emit(stateToSend ?? CurrentCartState(cart)));
  }
}
