import 'package:anyupp/app/ui/ui.dart';
import 'package:anyupp/domain/entities/restaurant.dart';
import 'package:anyupp/domain/states/states.dart';
import 'package:anyupp/domain/usecases/call_waiter_usecase.dart';
import 'package:anyupp/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'progress_indicator.dart';

class WaiterCallerViewModel {
  final bool working;
  final bool showWaiterCaller;
  final bool showConfirmation;

  WaiterCallerViewModel(
      {required this.working,
      required this.showWaiterCaller,
      this.showConfirmation = false});
}

class WaiterCallerPresenter extends StateNotifier<WaiterCallerViewModel>
    with Translater {
  final Reader _read;

  WaiterCallerPresenter(Restaurant? activeRestaurant,
      CallWaiterState callWaiterUsecaseState, this._read)
      : super(WaiterCallerViewModel(
            showWaiterCaller: activeRestaurant != null,
            working: callWaiterUsecaseState.working,
            showConfirmation: callWaiterUsecaseState.waiterCalled));

  onWaiterButtonPressed() async {
    _read(callWaiterUsecaseProvider.notifier).execute();
  }

  onCancelPressed() {
    _read(callWaiterUsecaseProvider.notifier).cancel();
  }

  onDialogDismissed() {
    _read(callWaiterUsecaseProvider.notifier).reset();
  }
}

final waiterCallerButtonProvider =
    StateNotifierProvider<WaiterCallerPresenter, WaiterCallerViewModel>((ref) {
  final activeRestaurant = ref.watch(activeRestaurantStateProvider);
  final callWaiterUsecaseState = ref.watch(callWaiterUsecaseProvider);
  return WaiterCallerPresenter(
      activeRestaurant, callWaiterUsecaseState, ref.read);
});

class WaiterCaller extends ConsumerWidget with Translater {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final presenter = ref.watch(waiterCallerButtonProvider.notifier);
    final model = ref.watch(waiterCallerButtonProvider);

    if (model.showConfirmation) {
      AnyuppAlertDialog().show(
          title: 'common.waiterCalledTitle',
          content: 'common.waiterCalledContent',
          onPressed: () => presenter.onDialogDismissed());
    }

    return model.showWaiterCaller
        ? Stack(children: [
            Align(
                alignment: Alignment.bottomRight,
                child: Container(
                    margin: const EdgeInsets.only(bottom: 16.0, right: 16.0),
                    child: SizedBox(
                        width: 100,
                        child: ElevatedButton(
                            onPressed: () => presenter.onWaiterButtonPressed(),
                            style: ElevatedButton.styleFrom(
                              primary: Colors.black,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(40),
                              ),
                            ),
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.room_service_outlined),
                                  Text(t(context, 'common.waiter'))
                                ]))))),
            if (model.working)
              Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.8),
                  ),
                  child: Stack(children: [
                    Align(
                        alignment: Alignment.center,
                        child: AnyuppProgressIndicator(
                          text: t(context, 'common.callingWaiter'),
                        )),
                    Align(
                      alignment: Alignment.topLeft,
                      child: IconButton(
                          icon: Icon(Icons.close_sharp),
                          onPressed: () => presenter.onCancelPressed()),
                    )
                  ]))
          ])
        : Container();
  }
}
