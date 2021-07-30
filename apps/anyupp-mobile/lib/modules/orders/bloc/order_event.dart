import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderAction extends Equatable {
  const BaseOrderAction();

  @override
  List<Object> get props => [];
}

class StartGetOrderListSubscription extends BaseOrderAction {
  final String chainId;
  final String unitId;
  const StartGetOrderListSubscription(this.chainId, this.unitId);

  @override
  List<Object> get props => [chainId, unitId];
}

class StopOrderListSubscription extends BaseOrderAction {
  const StopOrderListSubscription();
}

class StartGetOrderHistoryListSubscription extends BaseOrderAction {
  final String chainId;
  final String unitId;
  const StartGetOrderHistoryListSubscription(this.chainId, this.unitId);

  @override
  List<Object> get props => [chainId, unitId];
}

class StopOrderHistoryListSubscription extends BaseOrderAction {
  const StopOrderHistoryListSubscription();
}

class LoadOrderDetail extends BaseOrderAction {
  final String orderId;
  LoadOrderDetail({this.orderId});
  @override
  List<Object> get props => [orderId];
}

class LoadMoreOrders extends BaseOrderAction {
  final String unitId;
  final String nextToken;

  LoadMoreOrders(this.unitId, this.nextToken);
   @override
  List<Object> get props => [unitId, nextToken];
}

class LoadMoreOrderHistory extends BaseOrderAction {
  final String unitId;
  final String nextToken;

  LoadMoreOrderHistory(this.unitId, this.nextToken);
   @override
  List<Object> get props => [unitId, nextToken];
}
