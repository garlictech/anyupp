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
  const StartGetOrderListSubscription();
}

class StopOrderListSubscription extends BaseOrderAction {
  const StopOrderListSubscription();
}

class OrdersLoaded extends BaseOrderAction {
  final List<Order>? orders;
  final int totalCount;
  final bool hasMoreItems;
  final String? nextToken;

  OrdersLoaded(
      {this.orders,
      this.totalCount = 0,
      this.hasMoreItems = false,
      this.nextToken});

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
