import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';

import 'mocks.dart';

class MockCartBloc extends CartBloc {
  final Cart cart;

  MockCartBloc(this.cart)
      : super(
          MockCartRepository(cart),
          MockOrderRepository(),
          MockTakeAwayBloc(),
        );

  @override
  Stream<BaseCartState> mapEventToState(BaseCartAction action) async* {
    yield CurrentCartState(cart);
  }
}
