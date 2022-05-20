import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class OrderCounterBloc
    extends Bloc<BaseOrderCounterAction, BaseOrderCounterState> {
  final OrderRepository _repository;

  OrderCounterBloc(
    this._repository,
  ) : super(ActiveOrderCount(-1)) {
    on<GetActiveOrderCount>(_onGetActiveOrderCount);
    on<UpdateActiveOrderCount>(_UpdateActiveOrderCount);
  }

  FutureOr<void> _onGetActiveOrderCount(
      GetActiveOrderCount event, Emitter<BaseOrderCounterState> emit) async {
    try {
      int count = await _repository.getActiveOrderCount(event.unitId);
      emit(ActiveOrderCount(count));
    } on Exception catch (e) {
      log.e('OrderCounterBloc.error=$e');
      emit(OrderCounterLoadError('ORDER_COUNTER_BLOC', e.toString(), null));
    }
  }

  FutureOr<void> _UpdateActiveOrderCount(
      UpdateActiveOrderCount event, Emitter<BaseOrderCounterState> emit) {
    emit(ActiveOrderCount(event.count));
  }
}
