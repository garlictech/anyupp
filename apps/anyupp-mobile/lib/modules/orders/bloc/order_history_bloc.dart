import 'dart:async';

import 'package:fa_prev/models/Order.dart';
import 'package:fa_prev/modules/orders/bloc/order_history_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/modules/orders/orders.dart';
import 'package:rxdart/rxdart.dart';

class OrderHistoryBloc extends Bloc<BaseOrderHistoryAction, BaseOrderHistoryState> {
  final OrderRepository _repository;

  StreamController<List<Order>?>? _orderHistoryController;

  OrderHistoryBloc(
    this._repository,
  ) : super(OrderHistoryLoadingState());

  @override
  Stream<BaseOrderHistoryState> mapEventToState(BaseOrderHistoryAction event) async* {
    // print('OrderBloc.mapEventToState()=$event');
    try {
      if (event is OrderHistoryLoaded) {
        yield OrderHistoryLoadedState(
          orders: event.orders,
          nextToken: event.nextToken,
          hasMoreItems: event.hasMoreItems,
          totalCount: event.totalCount,
        );
      }

      if (event is LoadMoreOrderHistory) {
        if (_repository.orderHistoryListHasMoreItems) {
          yield OrderHistoryLoadingMoreState();
          List<Order>? items = await _repository.loadOrderHistoryNextPage(
            nextToken: event.nextToken,
            controller: _orderHistoryController!,
          );
          yield OrderHistoryLoadedState(
            orders: items,
            nextToken: _repository.orderHistoryListNextToken,
            hasMoreItems: _repository.orderHistoryListHasMoreItems,
            totalCount: _repository.orderHistoryListTotalCount,
          );
        }
      }

      if (event is StartGetOrderHistoryListSubscription) {
        yield OrderHistoryLoadingState();
        if (_orderHistoryController != null && !_orderHistoryController!.isClosed) {
          await _orderHistoryController?.close();
          _orderHistoryController = null;
        }
        await Future.delayed(Duration(microseconds: 700));
        _orderHistoryController = BehaviorSubject<List<Order>>();
        _orderHistoryController!.stream.asBroadcastStream().listen((orderHistoryList) {
          // print('OrderHistoryBloc.listen=${orderHistoryList?.length}');
          // print('********************* OrderBloc.HISTROY.hashCode=$hashCode');
          // print('********************* OrderBloc.HISTROY.state=${this.state}');
          add(OrderHistoryLoaded(
            orders: orderHistoryList,
            nextToken: _repository.orderHistoryListNextToken,
            hasMoreItems: _repository.orderHistoryListHasMoreItems,
            totalCount: _repository.orderHistoryListTotalCount,
          ));
        });
        await _repository.startOrderHistoryListSubscription(event.unitId, _orderHistoryController!);
      }

      if (event is StopOrderHistoryListSubscription) {
        await _repository.stopOrderHistoryListSubscription();
        yield NoOrderHistoryLoaded();
      }
    } on Exception catch (e) {
      print('OrderHistoryBloc.error=$e');
      yield OrderLoadHistoryError('ORDER_HISTORY_BLOC', e.toString(), null);
    }
  }

  @override
  Future<void> close() async {
    // print('OrderBloc.close()');
    await _orderHistoryController?.close();
    await _repository.stopOrderListSubscription();
    await _repository.stopOrderHistoryListSubscription();
    return super.close();
  }
}
