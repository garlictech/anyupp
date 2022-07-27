import 'dart:async';

import '/core/core.dart';
import '/models/Order.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '/modules/orders/orders.dart';
import 'package:rxdart/rxdart.dart';

class OrderBloc extends Bloc<BaseOrderAction, BaseOrderState> {
  final OrderRepository _repository;

  StreamController<List<Order>?>? _orderController;

  OrderBloc(
    this._repository,
  ) : super(OrdersLoadingState()) {
    on<OrdersLoaded>(_onOrdersLoaded);
    on<LoadMoreOrders>(_onLoadMoreOrders);
    on<StartGetOrderListSubscription>(_onStartGetOrderListSubscription);
    on<StopOrderListSubscription>(_onStopOrderListSubscription);
  }

  @override
  Future<void> close() async {
    // log.d('OrderBloc.close()');
    await _orderController?.close();
    await _repository.stopOrderListSubscription();
    await _repository.stopOrderHistoryListSubscription();
    return super.close();
  }

  FutureOr<void> _handleError(Exception e, Emitter<BaseOrderState> emit) {
    log.d('_handleError()=$e');
    emit(OrderLoadError('ORDER_BLOC', e.toString(), null));
  }

  FutureOr<void> _onOrdersLoaded(
      OrdersLoaded event, Emitter<BaseOrderState> emit) {
    log.d(
        '**** OrderBloc.OrderCounterBloc.add.UpdateActiveOrderCount(${event.totalCount})');
    getIt<OrderCounterBloc>().add(UpdateActiveOrderCount(event.totalCount));
    emit(OrdersLoadedState(
      orders: event.orders,
      nextToken: event.nextToken,
      hasMoreItems: event.hasMoreItems,
      totalCount: event.totalCount,
    ));
  }

  FutureOr<void> _onLoadMoreOrders(
      LoadMoreOrders event, Emitter<BaseOrderState> emit) async {
    try {
      if (_repository.orderListHasMoreItems) {
        emit(OrdersLoadingState());
        List<Order>? items = await _repository.loadOrdersNextPage(
          nextToken: event.nextToken,
          controller: _orderController!,
        );
        emit(OrdersLoadedState(
          orders: items ?? [],
          nextToken: _repository.orderListNextToken,
          hasMoreItems: _repository.orderListHasMoreItems,
          totalCount: _repository.orderListTotalCount,
        ));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStartGetOrderListSubscription(
      StartGetOrderListSubscription event, Emitter<BaseOrderState> emit) async {
    try {
      emit(OrdersLoadingState());
      // log.d('OrderBloc.mapEventToState().StartGetOrderListSubscription()');
      if (_orderController != null && !_orderController!.isClosed) {
        await _orderController!.close();
        _orderController = null;
      }
      await Future.delayed(Duration(microseconds: 700));
      _orderController = BehaviorSubject<List<Order>>();
      _orderController!.stream.asBroadcastStream().listen((orderList) {
        // log.d('********************* OrderBloc.ORDER.listen=${orderList?.length}');
        // log.d('********************* OrderBloc.ORDER.status=${order');
        // int count = orderList != null ? orderList.length : 0;
        add(OrdersLoaded(
          orders: orderList,
          nextToken: _repository.orderListNextToken,
          hasMoreItems: _repository.orderListHasMoreItems,
          totalCount: _repository.orderListTotalCount,
        ));
      });
      await _repository.startOrderListSubscription(_orderController!);
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStopOrderListSubscription(
      StopOrderListSubscription event, Emitter<BaseOrderState> emit) async {
    try {
      await _repository.stopOrderListSubscription();
      emit(NoOrdersLoaded());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }
}
