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

    _connectivitySubscription = Connectivity().onConnectivityChanged.asBroadcastStream().listen(
      (ConnectivityResult result) {
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

        // if (result == ConnectivityResult.none && _showingDialog != true) {
        //   _showingDialog = true;
        // } else if (_showingDialog != false) {
        //   _showingDialog = false;
        // }

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
