import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/models.dart';

part 'order_refresh_event.dart';
part 'order_refresh_state.dart';

class OrderRefreshBloc extends Bloc<OrderRefreshEvent, OrderRefreshState> {
  OrderRefreshBloc() : super(OrderRefreshInitial());

  @override
  Stream<OrderRefreshState> mapEventToState(OrderRefreshEvent event) async* {
    if (event is RefreshOrder) {
      yield OrderRefreshed(event.order);
    }
  }
}
