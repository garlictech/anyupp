import 'package:equatable/equatable.dart';
import 'package:fa_prev/models/Order.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderState extends Equatable {
  const BaseOrderState();

  @override
  List<Object?> get props => [];
}

class NoOrdersLoaded extends BaseOrderState {
  const NoOrdersLoaded();
}

class OrdersLoadingState extends BaseOrderState {}

class OrdersLoadedState extends BaseOrderState {
  final List<Order>? orders;
  final int totalCount;
  final bool hasMoreItems;
  final String? nextToken;
  final int timeStamp;

  OrdersLoadedState(
      {this.orders,
      this.hasMoreItems = false,
      this.totalCount = 0,
      this.nextToken})
      : timeStamp = DateTime.now().microsecondsSinceEpoch;

  @override
  List<Object?> get props =>
      [orders, totalCount, hasMoreItems, nextToken, timeStamp];
}

class OrderLoadError extends BaseOrderState {
  final String code;
  final String? message;
  final String? details;

  OrderLoadError(this.code, this.message, this.details);

  @override
  List<Object?> get props => [code, message, details];
}
