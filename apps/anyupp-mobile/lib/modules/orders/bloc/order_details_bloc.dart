import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/core/logger.dart';
import '/models.dart';
import '/modules/orders/orders.dart';

part 'order_details_event.dart';
part 'order_details_state.dart';

class OrderDetailsBloc extends Bloc<OrderDetailsEvent, OrderDetailsState> {
  final OrderRepository _repository;

  OrderDetailsBloc(this._repository) : super(OrderDetailsInitial()) {
    on<LoadOrderDetail>(_onLoadOrderDetail);
  }

  FutureOr<void> _onLoadOrderDetail(
      LoadOrderDetail event, Emitter<OrderDetailsState> emit) async {
    try {
      emit(OrderLoadingState());
      Order? order = await _repository.getOrder(event.orderId);
      emit(OrderDetailLoadedState(order: order));
    } on Exception catch (e) {
      _handleError(e, emit);
    }
  }

  FutureOr<void> _handleError(Exception e, Emitter<OrderDetailsState> emit) {
    log.d('_handleError()=$e');
    emit(LoadOrderError('ORDER_DETAILS_BLOC', e.toString(), null));
  }
}
