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

    if (event is LoadMoreOrders) {
      if (_repository.orderListHasMoreItems) {
        yield OrdersLoadingState();
        List<Order> items = await _repository.loadOrdersNextPage(event.unitId, event.nextToken);
        yield OrdersLoadedState(
         orders: items,
         nextToken: _repository.orderListNextToken,
         hasMoreItems: _repository.orderListHasMoreItems,
         totalCount: _repository.orderListTotalCount,
        );
      }
    }

    if (event is LoadMoreOrderHistory) {
      if (_repository.orderHistoryListHasMoreItems) {
        yield OrderHistoryLoadingState();
        List<Order> items = await _repository.loadOrderHistoryNextPage(event.unitId, event.nextToken);
        yield OrdersLoadedState(
         orders: items,
         nextToken: _repository.orderHistoryListNextToken,
         hasMoreItems: _repository.orderHistoryListHasMoreItems,
         totalCount: _repository.orderHistoryListTotalCount,
        );
      }
    }

    if (event is StartGetOrderListSubscription) {
      await _repository.startOrderListSubscription(event.unitId);
      await Future.delayed(Duration(milliseconds: 300));
      yield OrdersLoadedState(
         nextToken: _repository.orderListNextToken,
         hasMoreItems: _repository.orderListHasMoreItems,
         totalCount: _repository.orderListTotalCount,
        );
      yield OrderSubscriptionsState('OrderList', true);
    }

    if (event is StopOrderListSubscription) {
      await _repository.stopOrderListSubscription();
      yield OrderSubscriptionsState('OrderList', false);
    }

    if (event is StartGetOrderHistoryListSubscription) {
      await _repository.startOrderHistoryListSubscription(event.unitId);
      await Future.delayed(Duration(milliseconds: 300));
      yield OrdersLoadedState(
         nextToken: _repository.orderHistoryListNextToken,
         hasMoreItems: _repository.orderHistoryListHasMoreItems,
         totalCount: _repository.orderHistoryListTotalCount,
        );
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
