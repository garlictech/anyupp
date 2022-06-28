part of 'order_details_bloc.dart';

abstract class OrderDetailsState extends Equatable {
  const OrderDetailsState();

  @override
  List<Object?> get props => [];
}

class OrderDetailsInitial extends OrderDetailsState {}

class OrderLoadingState extends OrderDetailsState {}

class OrderDetailLoadedState extends OrderDetailsState {
  final Order? order;
  const OrderDetailLoadedState({this.order});

  @override
  List<Object?> get props => [order];
}

class LoadOrderError extends OrderDetailsState {
  final String code;
  final String? message;
  final String? details;

  LoadOrderError(this.code, this.message, this.details);

  @override
  List<Object?> get props => [code, message, details];
}
