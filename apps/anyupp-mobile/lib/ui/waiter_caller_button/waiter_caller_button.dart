import 'dart:async';
import 'package:async/async.dart';
import 'package:anyupp/ui/ui.dart';
import 'package:anyupp/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WaiterCallerButtonViewModel {
  final bool working;

  WaiterCallerButtonViewModel({this.working = false});
}

class WaiterCallerButtonPresenter
    extends StateNotifier<WaiterCallerButtonViewModel> with Translater {
  CancelableOperation? _waiterCallerOp;

  WaiterCallerButtonPresenter() : super(WaiterCallerButtonViewModel());

  callWaiter(BuildContext context, String unitId) async {
    state = WaiterCallerButtonViewModel(working: true);
    waiterCallerFuture() {
      return Future.delayed(const Duration(seconds: 5)).then((_) {
        if (_waiterCallerOp != null) {
          _waiterCallerOp = null;
          state = WaiterCallerButtonViewModel(working: false);
          showDialog(
              context: context,
              builder: (BuildContext context) => AlertDialog(
                      title: Text(t(context, 'common.waiterCalledTitle')),
                      content: Text(t(context, 'common.waiterCalledContent')),
                      actions: <Widget>[
                        TextButton(
                          onPressed: () => Navigator.pop(context, 'OK'),
                          child: const Text('OK'),
                        ),
                      ]));
        }
        return Future.value(true);
      });
    }

    _waiterCallerOp = CancelableOperation.fromFuture(
      waiterCallerFuture(),
      onCancel: () {
        state = WaiterCallerButtonViewModel(working: false);
      },
    );
  }

  onCancel() {
    _waiterCallerOp?.cancel();
    _waiterCallerOp = null;
  }
}

final waiterCallerButtonProvider = StateNotifierProvider<
    WaiterCallerButtonPresenter, WaiterCallerButtonViewModel>((ref) {
  return WaiterCallerButtonPresenter();
});

class WaiterCallerButton extends ConsumerWidget with Translater {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final presenter = ref.watch(waiterCallerButtonProvider.notifier);
    final model = ref.watch(waiterCallerButtonProvider);

    return Stack(children: [
      Align(
          alignment: Alignment.bottomRight,
          child: Container(
              margin: const EdgeInsets.only(bottom: 16.0, right: 16.0),
              child: SizedBox(
                  width: 100,
                  child: ElevatedButton(
                      onPressed: () => presenter.callWaiter(context, ""),
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
                    onPressed: () {
                      presenter.onCancel();
                    }),
              )
            ]))
    ]);
  }
}
