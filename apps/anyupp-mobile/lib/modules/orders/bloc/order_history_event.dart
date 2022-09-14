import 'package:equatable/equatable.dart';
import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderHistoryAction extends Equatable {
  const BaseOrderHistoryAction();

  @override
  List<Object?> get props => [];
}

class StartGetOrderHistoryListSubscription extends BaseOrderHistoryAction {
  const StartGetOrderHistoryListSubscription();
}

class StopOrderHistoryListSubscription extends BaseOrderHistoryAction {
  const StopOrderHistoryListSubscription();
}

class LoadMoreOrderHistory extends BaseOrderHistoryAction {
  final String? nextToken;

  LoadMoreOrderHistory(this.nextToken);
  @override
  List<Object?> get props => [nextToken];
}

class OrderHistoryLoaded extends BaseOrderHistoryAction {
  final List<Order>? orders;
  final int totalCount;
  final bool hasMoreItems;
  final String? nextToken;

  OrderHistoryLoaded(
      {this.orders,
      this.totalCount = 0,
      this.hasMoreItems = false,
      this.nextToken});

  @override
  List<Object?> get props => [orders, totalCount, hasMoreItems, nextToken];
}
