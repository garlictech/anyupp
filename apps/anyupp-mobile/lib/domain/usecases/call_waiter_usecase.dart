import 'package:anyupp/core/dependency_indjection/dependency_injection.dart';
import 'package:anyupp/core/units/provider/unit_provider_interface.dart';
import 'package:anyupp/graphql/generated/crud-api.graphql.dart';
import 'package:anyupp/models/Unit.dart';
import 'package:anyupp/shared/utils/place_preferences.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../modules/cart/models/cart_constants.dart';

class CallWaiterState {
  final bool working;
  final bool cancelled;
  final bool errored;
  final bool called;

  CallWaiterState(
      {this.working = false,
      this.errored = false,
      this.cancelled = false,
      this.called = false});
}

class CallWaiterUsecase extends StateNotifier<CallWaiterState> {
  CallWaiterUsecase() : super(CallWaiterState());

  execute(Unit unit) {
    if (!state.working) {
      state = CallWaiterState(
          working: true, errored: false, cancelled: false, called: false);

      getPlacePref(unit.id)
          .then((place) => getIt<IUnitProvider>().callWaiter(CallWaiterInput(
              unitId: unit.id,
              place: place != null
                  ? PlaceInput(seat: place.seat!, table: place.table!)
                  : PlaceInput(seat: EMPTY_SEAT, table: EMPTY_TABLE),
              guestLabel: "anyupp_guest")))
          .then((_) {
        state = CallWaiterState(
            working: false, errored: false, cancelled: false, called: true);
      }).onError((err, _) {
        debugPrint("Error on waiter caller: ${err}");
        state = state.cancelled
            ? CallWaiterState()
            : CallWaiterState(
                working: false, cancelled: false, errored: true, called: false);
      });
    }
  }

  cancel() async {
    state = CallWaiterState(
        working: false, cancelled: true, errored: false, called: false);
  }

  reset() async {
    state = CallWaiterState();
  }
}

final callWaiterUsecaseProvider =
    StateNotifierProvider<CallWaiterUsecase, CallWaiterState>((ref) {
  return CallWaiterUsecase();
});
