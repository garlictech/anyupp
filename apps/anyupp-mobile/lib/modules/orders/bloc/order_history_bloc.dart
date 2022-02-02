import 'dart:async';

import 'package:fa_prev/models/Order.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/orders/orders.dart';
import 'package:rxdart/rxdart.dart';

class OrderHistoryBloc
    extends Bloc<BaseOrderHistoryAction, BaseOrderHistoryState> {
  final OrderRepository _repository;

  StreamController<List<Order>?>? _orderHistoryController;

  OrderHistoryBloc(
    this._repository,
  ) : super(OrderHistoryLoadingState()) {
    on<OrderHistoryLoaded>(_onOrderHistoryLoaded);
    on<LoadMoreOrderHistory>(_onLoadMoreOrderHistory);
    on<StartGetOrderHistoryListSubscription>(_onStartOrderHistorySubscription);
    on<StopOrderHistoryListSubscription>(_onStopOrderHistorySubscription);
  }

  @override
  Future<void> close() async {
    // print('OrderBloc.close()');
    await _orderHistoryController?.close();
    await _repository.stopOrderListSubscription();
    await _repository.stopOrderHistoryListSubscription();
    return super.close();
  }

  FutureOr<void> _handleError(
      Exception e, Emitter<BaseOrderHistoryState> emit) {
    print('OrderHistoryBloc.error=$e');
    emit(OrderLoadHistoryError('ORDER_HISTORY_BLOC', e.toString(), null));
  }

  FutureOr<void> _onOrderHistoryLoaded(
      OrderHistoryLoaded event, Emitter<BaseOrderHistoryState> emit) {
    emit(OrderHistoryLoadedState(
      orders: event.orders,
      nextToken: event.nextToken,
      hasMoreItems: event.hasMoreItems,
      totalCount: event.totalCount,
    ));
  }

  FutureOr<void> _onLoadMoreOrderHistory(
      LoadMoreOrderHistory event, Emitter<BaseOrderHistoryState> emit) async {
    try {
      if (_repository.orderHistoryListHasMoreItems) {
        emit(OrderHistoryLoadingMoreState());
        List<Order>? items = await _repository.loadOrderHistoryNextPage(
          nextToken: event.nextToken,
          controller: _orderHistoryController!,
        );
        emit(OrderHistoryLoadedState(
          orders: items,
          nextToken: _repository.orderHistoryListNextToken,
          hasMoreItems: _repository.orderHistoryListHasMoreItems,
          totalCount: _repository.orderHistoryListTotalCount,
        ));
      }
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStartOrderHistorySubscription(
      StartGetOrderHistoryListSubscription event,
      Emitter<BaseOrderHistoryState> emit) async {
    try {
      emit(OrderHistoryLoadingState());
      if (_orderHistoryController != null &&
          !_orderHistoryController!.isClosed) {
        await _orderHistoryController?.close();
        _orderHistoryController = null;
      }
      await Future.delayed(Duration(microseconds: 700));
      _orderHistoryController = BehaviorSubject<List<Order>>();
      _orderHistoryController!.stream
          .asBroadcastStream()
          .listen((orderHistoryList) {
        print('OrderHistoryBloc.listen=${orderHistoryList?.length}');
        print(
            'OrderHistoryBloc.listen=${orderHistoryList?.map((order) => order.hasRated)}');

        // print('********************* OrderBloc.HISTROY.hashCode=$hashCode');
        // print('********************* OrderBloc.HISTROY.state=${this.state}');
        add(OrderHistoryLoaded(
          orders: orderHistoryList,
          nextToken: _repository.orderHistoryListNextToken,
          hasMoreItems: _repository.orderHistoryListHasMoreItems,
          totalCount: _repository.orderHistoryListTotalCount,
        ));
      });
      await _repository.startOrderHistoryListSubscription(
          event.unitId, _orderHistoryController!);
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _onStopOrderHistorySubscription(
    StopOrderHistoryListSubscription event,
    Emitter<BaseOrderHistoryState> emit,
  ) async {
    try {
      await _repository.stopOrderHistoryListSubscription();
      emit(NoOrderHistoryLoaded());
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }
}
