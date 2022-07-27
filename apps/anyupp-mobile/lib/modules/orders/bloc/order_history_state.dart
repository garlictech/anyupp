import 'package:equatable/equatable.dart';
import '/models/Order.dart';
import 'package:flutter/foundation.dart';

@immutable
abstract class BaseOrderHistoryState extends Equatable {
  const BaseOrderHistoryState();

  @override
  List<Object?> get props => [];
}

class NoOrderHistoryLoaded extends BaseOrderHistoryState {
  const NoOrderHistoryLoaded();
}

class OrderHistoryLoadingState extends BaseOrderHistoryState {}

class OrderHistoryLoadingMoreState extends BaseOrderHistoryState {}

class OrderHistoryLoadedState extends BaseOrderHistoryState {
  final List<Order>? orders;
  final int totalCount;
  final bool hasMoreItems;
  final String? nextToken;
  final int timeStamp;

  OrderHistoryLoadedState({this.orders, this.hasMoreItems = false, this.totalCount = 0, this.nextToken})
      : timeStamp = DateTime.now().microsecondsSinceEpoch;

  @override
  List<Object?> get props => [orders, totalCount, hasMoreItems, nextToken, timeStamp];
}

class OrderLoadHistoryError extends BaseOrderHistoryState {
  final String code;
  final String? message;
  final String? details;

  OrderLoadHistoryError(this.code, this.message, this.details);

  @override
  List<Object?> get props => [code, message, details];
}
