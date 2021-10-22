part of 'order_refresh_bloc.dart';

abstract class OrderRefreshState extends Equatable {
  const OrderRefreshState();

  @override
  List<Object> get props => [];
}

class OrderRefreshInitial extends OrderRefreshState {}

class OrderRefreshed extends OrderRefreshState {
  final Order order;

  OrderRefreshed(this.order);

  @override
  List<Object> get props => [order];
}
