part of 'order_details_bloc.dart';

abstract class OrderDetailsEvent extends Equatable {
  const OrderDetailsEvent();

  @override
  List<Object> get props => [];
}

class LoadOrderDetail extends OrderDetailsEvent {
  final String orderId;
  LoadOrderDetail({required this.orderId});
  @override
  List<Object> get props => [orderId];
}
