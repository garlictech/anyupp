import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/Order.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/orders/orders.dart';
import 'package:rxdart/rxdart.dart';

import 'order_event.dart';
import 'order_state.dart';

class OrderBloc extends Bloc<BaseOrderAction, BaseOrderState> {
  final OrderRepository _repository;

  StreamController<List<Order>> _orderController;

  OrderBloc(
    this._repository,
  ) : super(OrdersLoadingState());

  @override
  Stream<BaseOrderState> mapEventToState(BaseOrderAction event) async* {
    // print('OrderBloc.mapEventToState()=$event');
    try {
      if (event is OrdersLoaded) {
        print('**** OrderBloc.OrderCounterBloc.add.UpdateActiveOrderCount(${event.totalCount})');
        getIt<OrderCounterBloc>().add(UpdateActiveOrderCount(event.totalCount));
        yield OrdersLoadedState(
          orders: event.orders,
          nextToken: event.nextToken,
          hasMoreItems: event.hasMoreItems,
          totalCount: event.totalCount,
        );
      }
      if (event is LoadMoreOrders) {
        if (_repository.orderListHasMoreItems) {
          yield OrdersLoadingState();
          List<Order> items = await _repository.loadOrdersNextPage(
            unitId: event.unitId,
            nextToken: event.nextToken,
            controller: _orderController,
          );
          yield OrdersLoadedState(
            orders: items,
            nextToken: _repository.orderListNextToken,
            hasMoreItems: _repository.orderListHasMoreItems,
            totalCount: _repository.orderListTotalCount,
          );
        }
      }

      if (event is StartGetOrderListSubscription) {
        yield OrdersLoadingState();
        // print('OrderBloc.mapEventToState().StartGetOrderListSubscription()');
        if (_orderController != null && !_orderController.isClosed) {
          await _orderController.close();
          _orderController = null;
        }
        await Future.delayed(Duration(microseconds: 700));
        _orderController = BehaviorSubject<List<Order>>();
        _orderController.stream.asBroadcastStream().listen((orderList) {
          // print('********************* OrderBloc.ORDER.listen=${orderList?.length}');
          // print('********************* OrderBloc.ORDER.status=${order');
          // int count = orderList != null ? orderList.length : 0;
          add(OrdersLoaded(
            orders: orderList,
            nextToken: _repository.orderListNextToken,
            hasMoreItems: _repository.orderListHasMoreItems,
            totalCount: _repository.orderListTotalCount,
          ));
        });
        await _repository.startOrderListSubscription(event.unitId, _orderController);
      }

      if (event is StopOrderListSubscription) {
        await _repository.stopOrderListSubscription();
        yield NoOrdersLoaded();
        ;
      }

      if (event is LoadOrderDetail) {
        Order order = await _repository.getOrder(event.orderId);
        yield OrderDetailLoadedState(order: order);
      }
    } on Exception catch (e) {
      print('OrderHistoryBloc.error=$e');
      yield OrderLoadError('ORDER_BLOC', e.toString(), null);
    }
  }

  @override
  Future<void> close() async {
    // print('OrderBloc.close()');
    await _orderController?.close();
    await _repository.stopOrderListSubscription();
    await _repository.stopOrderHistoryListSubscription();
    return super.close();
  }
}
