import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/modules/orders/orders.dart';

class OrderCounterBloc extends Bloc<BaseOrderCounterAction, BaseOrderCounterState> {
  final OrderRepository _repository;

  OrderCounterBloc(
    this._repository,
  ) : super(ActiveOrderCount(-1));

  @override
  Stream<BaseOrderCounterState> mapEventToState(BaseOrderCounterAction event) async* {
    print('**** OrderCounterBloc.mapEventToState=$event');
    try {
      if (event is GetActiveOrderCount) {
        int count = await _repository.getActiveOrderCount(event.unitId);
        yield ActiveOrderCount(count);
      }

      if (event is UpdateActiveOrderCount) {
        yield ActiveOrderCount(event.count);
      }
    } on Exception catch (e) {
      print('OrderCounterBloc.error=$e');
      yield OrderCounterLoadError('ORDER_COUNTER_BLOC', e.toString(), null);
    }
  }
}
