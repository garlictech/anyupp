// ignore_for_file: must_call_super

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:anyupp/shared/connectivity.dart';

class MockNetworkStatusBloc extends NetworkStatusBloc {
  MockNetworkStatusBloc() {
    on((event, emit) => emit(
          NetworkState(
            ConnectivityResult.wifi,
            true,
            false,
            false,
          ),
        ));
  }

  NetworkState get state => NetworkState(
        ConnectivityResult.wifi,
        true,
        false,
        false,
      );

  @override
  Future<void> close() async {
    return;
  }
}
