import 'package:flutter_bloc/flutter_bloc.dart';

import './configset_event.dart';
import './configset_state.dart';

class ConfigsetBloc extends Bloc<ConfigsetEvent, ConfigsetState> {
  ConfigsetBloc() : super(ConfigsetInitial());

  @override
  Stream<ConfigsetState> mapEventToState(
    ConfigsetEvent event,
  ) async* {
    // TODO: implement mapEventToState
    if (event is ConfigsetUpdatedEvent) {
      yield ConfigsetUpdated(orderItem: event.orderItem, unit: event.unit, totalPrice: event.totalPrice);
    }
  }
}
