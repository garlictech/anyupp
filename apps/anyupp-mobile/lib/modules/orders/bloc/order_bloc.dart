import 'package:flutter_bloc/flutter_bloc.dart';

import 'order_event.dart';
import 'order_state.dart';

class OrderBloc extends Bloc<BaseOrderAction, BaseOrderState> {
  OrderBloc(BaseOrderState initialState) : super(NoOrderState());

  @override
  Stream<BaseOrderState> mapEventToState(BaseOrderAction event) {

    if (event is RefreshOrderAction) {
       // TODO how to implement this call? > _orderService.getCurrentOrder('unitId');
    }

    return null;
  }

}
