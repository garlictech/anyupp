import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderHistoryAction extends Equatable {
  const BaseOrderHistoryAction();

  @override
  List<Object> get props => [];
}

class StartGetOrderHistoryListSubscription extends BaseOrderHistoryAction {
  final String unitId;
  const StartGetOrderHistoryListSubscription(this.unitId);

  @override
  List<Object> get props => [unitId];
}

class StopOrderHistoryListSubscription extends BaseOrderHistoryAction {
  const StopOrderHistoryListSubscription();
}

class LoadMoreOrderHistory extends BaseOrderHistoryAction {
  final String unitId;
  final String nextToken;

  LoadMoreOrderHistory(this.unitId, this.nextToken);
  @override
  List<Object> get props => [unitId, nextToken];
}

class OrderHistoryLoaded extends BaseOrderHistoryAction {
  final List<Order> orders;
  final int totalCount;
  final bool hasMoreItems;
  final String nextToken;

  OrderHistoryLoaded({this.orders, this.totalCount, this.hasMoreItems, this.nextToken});

  @override
  List<Object> get props => [orders, totalCount, hasMoreItems, nextToken];
}
