import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import '/models.dart';

part 'order_refresh_event.dart';
part 'order_refresh_state.dart';

class OrderRefreshBloc extends Bloc<OrderRefreshEvent, OrderRefreshState> {
  OrderRefreshBloc() : super(OrderRefreshInitial()) {
    on<RefreshOrder>(
      (event, emit) => emit(OrderRefreshed(event.order)),
    );
  }
}
