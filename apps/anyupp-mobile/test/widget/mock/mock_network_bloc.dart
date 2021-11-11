// ignore_for_file: must_call_super

import 'package:connectivity/connectivity.dart';
import 'package:fa_prev/shared/connectivity.dart';

class MockNetworkStatusBloc extends NetworkStatusBloc {
  MockNetworkStatusBloc();

  NetworkState get state => NetworkState(
        ConnectivityResult.wifi,
        true,
        false,
        false,
      );

  @override
  Stream<NetworkState> mapEventToState(NetworkStatusEvent event) async* {
    if (event is NetworkConnectionChangedEvent) {
      yield NetworkState(
        ConnectivityResult.wifi,
        true,
        false,
        false,
      );
    }
  }

  @override
  Future<void> close() async {
    return;
  }
}
