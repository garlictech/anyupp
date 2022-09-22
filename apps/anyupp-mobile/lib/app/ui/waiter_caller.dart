import 'package:anyupp/app/ui/ui.dart';
import 'package:anyupp/core/units/bloc/unit_select_bloc.dart';
import 'package:anyupp/domain/usecases/call_waiter_usecase.dart';
import 'package:anyupp/models/Unit.dart';
import 'package:anyupp/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WaiterCallerViewModel {}

class WaiterCallerPresenter extends StateNotifier<WaiterCallerViewModel>
    with Translater {
  final Reader _read;

  WaiterCallerPresenter(this._read) : super(WaiterCallerViewModel());

  onWaiterButtonPressed(Unit? unit) async {
    if (unit != null) {
      _read(callWaiterUsecaseProvider.notifier).execute(unit);
    }
  }

  onCancelPressed() {
    _read(callWaiterUsecaseProvider.notifier).cancel();
  }

  onConfirmPressed() {
    _read(callWaiterUsecaseProvider.notifier).reset();
  }
}

final waiterCallerButtonProvider =
    StateNotifierProvider<WaiterCallerPresenter, WaiterCallerViewModel>((ref) {
  return WaiterCallerPresenter(ref.read);
});

class WaiterCaller extends ConsumerWidget with Translater {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final presenter = ref.watch(waiterCallerButtonProvider.notifier);
    final callWaiterUsecaseState = ref.watch(callWaiterUsecaseProvider);

    return BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (BuildContext context, UnitSelectState state) {
      return Consumer(builder: (context, ref, child) {
        final enableButton =
            (state.currentUnit?.canCallWaiter ?? false) == true;

        return enableButton
            ? Stack(children: [
                Align(
                    alignment: Alignment.bottomRight,
                    child: Container(
                        margin:
                            const EdgeInsets.only(bottom: 16.0, right: 16.0),
                        child: SizedBox(
                            width: 100,
                            child: ElevatedButton(
                                onPressed: enableButton
                                    ? () => presenter.onWaiterButtonPressed(
                                        state.currentUnit)
                                    : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.black,
                                  foregroundColor: Colors.white,
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
                if (callWaiterUsecaseState.working)
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
                      ])),
                if (callWaiterUsecaseState.errored &&
                    !callWaiterUsecaseState.cancelled)
                  Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.8),
                      ),
                      child: Align(
                          alignment: Alignment.center,
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(t(context, 'common.waiterCallerError')
                                    .toUpperCase()),
                                IconButton(
                                    icon: Icon(Icons.close_sharp),
                                    onPressed: () =>
                                        presenter.onConfirmPressed()),
                              ]))),
                if (callWaiterUsecaseState.called)
                  Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.8),
                      ),
                      child: Align(
                          alignment: Alignment.center,
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(t(context, 'common.waiterCalledContent')
                                    .toUpperCase()),
                                IconButton(
                                    icon: Icon(Icons.close_sharp),
                                    onPressed: () =>
                                        presenter.onConfirmPressed()),
                              ]))),
              ])
            : SizedBox.shrink();
      });
    });
  }
}
