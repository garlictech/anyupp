import 'package:async/async.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../states/active_restaurant_state.dart';

class CallWaiterState {
  final bool working;
  final bool waiterCalled;
  final String? errored;

  CallWaiterState(
      {this.working = false, this.waiterCalled = false, this.errored});
}

class CallWaiterUsecase extends StateNotifier<CallWaiterState> {
  final Reader _read;
  CancelableOperation? _waiterCallerOp;

  CallWaiterUsecase(this._read) : super(CallWaiterState());

  execute() {
    final activeRestaurant = _read(activeRestaurantStateProvider);

    if (activeRestaurant == null) {
      throw "No active restaurant, cannot call waiter!";
    }

    if (!state.working) {
      state =
          CallWaiterState(working: true, waiterCalled: false, errored: null);

      _waiterCallerOp =
          CancelableOperation.fromFuture(_waiterCallerFuture(), onCancel: () {
        state =
            CallWaiterState(working: false, waiterCalled: false, errored: null);
      });
    }
  }

  cancel() async {
    await _waiterCallerOp?.cancel();
    _waiterCallerOp = null;
  }

  reset() async {
    state = CallWaiterState();
  }

  _waiterCallerFuture() {
    return Future.delayed(const Duration(seconds: 5)).then((_) {
      if (_waiterCallerOp != null) {
        _waiterCallerOp = null;
        state =
            CallWaiterState(working: false, waiterCalled: true, errored: null);
      }
    });
  }
}

final callWaiterUsecaseProvider =
    StateNotifierProvider<CallWaiterUsecase, CallWaiterState>((ref) {
  return CallWaiterUsecase(ref.read);
});
