import 'dart:async';
import 'dart:io';

import 'package:connectivity/connectivity.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class NetworkStatusBloc extends Bloc<NetworkStatusEvent, NetworkState> {
  late StreamSubscription _connectivitySubscription;
  ConnectivityResult? _lastState;
  bool? _hasDataConnection;

  NetworkStatusBloc()
      : super(NetworkState(ConnectivityResult.wifi, true, null, null)) {
    _initConnectionSubscription();
    log.d(
        'NetworkStatusBloc.constructor()._connectivitySubscription=$_connectivitySubscription');

    Connectivity().checkConnectivity().then((result) {
      log.d('NetworkStatusBloc.checkConnectivity()=$result');
      checkDataConnection().then((value) =>
          add(NetworkConnectionChangedEvent(result, value, false, false)));
    });
    on<NetworkConnectionChangedEvent>(_onNetworkConnectionChangedEvent);
  }

  ConnectivityResult? getLastConnectivityResult() {
    return _lastState;
  }

  Future<bool> checkDataConnection() async {
    try {
      final result = await InternetAddress.lookup('google.com');
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
        return Future.value(true);
      }
    } on SocketException catch (_) {
      return Future.value(false);
    }
    return Future.value(false);
  }

  void _initConnectionSubscription() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen(
      (ConnectivityResult result) async {
        log.d('NetworkStatusBloc.result=$result');
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

        _hasDataConnection = await checkDataConnection();
        add(NetworkConnectionChangedEvent(
            result, _hasDataConnection, show, hide));
        _lastState = result;
      },
    );
  }

  void tryToReconnect() async {
    while (_hasDataConnection != true) {
      _hasDataConnection = await checkDataConnection();
      if (_hasDataConnection! && _lastState != null) {
        add(NetworkConnectionChangedEvent(
            _lastState!, _hasDataConnection, false, true));
        break;
      }
      await Future.delayed(Duration(seconds: 5));
    }
  }

  @override
  Future<void> close() async {
    log.d(
        'NetworkStatusBloc.close()._connectivitySubscription=$_connectivitySubscription');
    await _connectivitySubscription.cancel();
    return super.close();
  }

  FutureOr<void> _onNetworkConnectionChangedEvent(
      NetworkConnectionChangedEvent event, Emitter<NetworkState> emit) {
    if ([ConnectivityResult.mobile, ConnectivityResult.wifi]
            .contains(event.state) &&
        (event.hasDataConnection != true)) {
      _hasDataConnection = event.hasDataConnection;
      tryToReconnect();
    }
    emit(NetworkState(
      event.state,
      event.hasDataConnection,
      event.showDialog,
      event.hideDialog,
    ));
  }
}
