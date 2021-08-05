import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PaymentBloc extends Bloc<BasePaymentEvent, BasePaymentState> {
  final OrderRepository _orderService;

  PaymentBloc(this._orderService) : super(PaymentNoState());

  @override
  Stream<BasePaymentState> mapEventToState(BasePaymentEvent event) async* {
    if (event is UserPaymentIntentionSignalAction) {
      yield PaymentInProgress();
      await _orderService.userPaymentIntentionSignal(event.unit.id);
      yield PaymentNoState();
    }
  }
}
