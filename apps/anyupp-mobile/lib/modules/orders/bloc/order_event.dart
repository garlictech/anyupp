import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderAction extends Equatable {
  const BaseOrderAction();

  @override
  List<Object?> get props => [];
}

class StartGetOrderListSubscription extends BaseOrderAction {
  final String chainId;
  final String unitId;
  const StartGetOrderListSubscription(this.chainId, this.unitId);

  @override
  List<Object?> get props => [chainId, unitId];
}

class StopOrderListSubscription extends BaseOrderAction {
  const StopOrderListSubscription();
}

class LoadOrderDetail extends BaseOrderAction {
  final String orderId;
  LoadOrderDetail({required this.orderId});
  @override
  List<Object?> get props => [orderId];
}

class OrdersLoaded extends BaseOrderAction {
  final List<Order>? orders;
  final int totalCount;
  final bool hasMoreItems;
  final String? nextToken;

  OrdersLoaded({this.orders, this.totalCount = 0, this.hasMoreItems = false, this.nextToken});

  @override
  List<Object?> get props => [orders, totalCount, hasMoreItems, nextToken];
}

class LoadMoreOrders extends BaseOrderAction {
  final String unitId;
  final String nextToken;

  LoadMoreOrders(this.unitId, this.nextToken);
  @override
  List<Object?> get props => [unitId, nextToken];
}
