import 'package:flutter_bloc/flutter_bloc.dart';

import './configset_event.dart';
import './configset_state.dart';

class ConfigsetBloc extends Bloc<ConfigsetEvent, ConfigsetState> {
  ConfigsetBloc() : super(ConfigsetInitial()) {
    on<ConfigsetUpdatedEvent>((event, emit) => emit(
          ConfigsetUpdated(
            orderItem: event.orderItem,
            unit: event.unit,
            totalPrice: event.totalPrice,
          ),
        ));
  }
}
