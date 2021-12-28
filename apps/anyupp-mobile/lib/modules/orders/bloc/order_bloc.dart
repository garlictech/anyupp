import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/Order.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/orders/orders.dart';
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
    on<LoadOrderDetail>(_onLoadOrderDetail);
  }

  @override
  Future<void> close() async {
    // print('OrderBloc.close()');
    await _orderController?.close();
    await _repository.stopOrderListSubscription();
    await _repository.stopOrderHistoryListSubscription();
    return super.close();
  }

  FutureOr<void> _handleError(Exception e, Emitter<BaseOrderState> emit) {
    emit(OrderLoadError('ORDER_BLOC', e.toString(), null));
  }

  FutureOr<void> _onOrdersLoaded(
      OrdersLoaded event, Emitter<BaseOrderState> emit) {
    print(
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
      // print('OrderBloc.mapEventToState().StartGetOrderListSubscription()');
      if (_orderController != null && !_orderController!.isClosed) {
        await _orderController!.close();
        _orderController = null;
      }
      await Future.delayed(Duration(microseconds: 700));
      _orderController = BehaviorSubject<List<Order>>();
      _orderController!.stream.asBroadcastStream().listen((orderList) {
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
      await _repository.startOrderListSubscription(
          event.unitId, _orderController!);
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

  FutureOr<void> _onLoadOrderDetail(
      LoadOrderDetail event, Emitter<BaseOrderState> emit) async {
    try {
      Order? order = await _repository.getOrder(event.orderId);
      emit(OrderDetailLoadedState(order: order));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }
}
