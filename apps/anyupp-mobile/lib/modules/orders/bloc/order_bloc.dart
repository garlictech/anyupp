import 'package:fa_prev/models/Order.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/orders/orders.dart';

import 'order_event.dart';
import 'order_state.dart';

class OrderBloc extends Bloc<BaseOrderAction, BaseOrderState> {
  final OrderRepository _repository;

  OrderBloc(
    this._repository,
  ) : super(NoOrdersLoaded());

  @override
  Stream<BaseOrderState> mapEventToState(BaseOrderAction event) async* {
    if (event is StartGetOrderListSubscription) {
      await _repository.startOrderListSubscription(event.unitId);
      yield OrderSubscriptionsState('OrderList', true);
    }

    if (event is StopOrderListSubscription) {
      await _repository.stopOrderListSubscription();
      yield OrderSubscriptionsState('OrderList', false);
    }

    if (event is StartGetOrderHistoryListSubscription) {
      await _repository.startOrderHistoryListSubscription(event.unitId);
      yield OrderSubscriptionsState('OrderHistoryList', true);
    }

    if (event is StopOrderHistoryListSubscription) {
      await _repository.stopOrderHistoryListSubscription();
      yield OrderSubscriptionsState('OrderHistoryList', false);
    }
    if (event is LoadOrderDetail) {
      Order order = await _repository.getOrder(event.orderId);
      yield OrderDetailLoadedState(order: order);
    }
  }
}
