import 'dart:async';

import 'package:connectivity/connectivity.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/connectivity/bloc/network_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class NetworkStatusBloc extends Bloc<NetworkStatusEvent, NetworkState> {
  StreamSubscription _connectivitySubscription;
  ConnectivityResult _lastState;

  NetworkStatusBloc() : super(NetworkState(ConnectivityResult.none, null, null)) {
    print('NetworkStatusBloc.constructor()._connectivitySubscription=$_connectivitySubscription');

    if (_connectivitySubscription != null) {
      _connectivitySubscription.cancel().then((value) => _initConnectionSubscription);
    } else {
      _initConnectionSubscription();
    }

    Connectivity().checkConnectivity().then((result) {
      print('NetworkStatusBloc.checkConnectivity()=$result');
      add(NetworkConnectionChangedEvent(result, false, false));
    });
  }

  void _initConnectionSubscription() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen(
      (ConnectivityResult result) {
        print('NetworkStatusBloc.result=$result');
        bool show = false;
        bool hide = false;

        if (_lastState != result) {
          show = false;
          hide = false;

          if (result == ConnectivityResult.none) {
            show = true;
          }

          if (_lastState == ConnectivityResult.none) {
            hide = true;
          }
        }
        add(NetworkConnectionChangedEvent(result, show, hide));
        _lastState = result;
      },
    );
  }

  @override
  Stream<NetworkState> mapEventToState(NetworkStatusEvent event) async* {
    if (event is NetworkConnectionChangedEvent) {
      yield NetworkState(event.state, event.showDialog, event.hideDialog);
    }
  }

  @override
  Future<void> close() async {
    print('NetworkStatusBloc.close()._connectivitySubscription=$_connectivitySubscription');
    await _connectivitySubscription?.cancel();
    return super.close();
  }
}
