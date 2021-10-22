part of 'order_refresh_bloc.dart';

abstract class OrderRefreshEvent extends Equatable {
  const OrderRefreshEvent();

  @override
  List<Object> get props => [];
}

class RefreshOrder extends OrderRefreshEvent {
  final Order order;

  RefreshOrder(this.order);

  @override
  List<Object> get props => [];
}
