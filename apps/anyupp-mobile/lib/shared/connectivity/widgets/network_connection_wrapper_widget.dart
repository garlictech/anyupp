import 'package:connectivity/connectivity.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

typedef ConnectivityCallback = Function(ConnectivityResult);

class NetworkConnectionWrapperWidget extends StatelessWidget {
  NetworkConnectionWrapperWidget({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<NetworkStatusBloc, NetworkState>(
        builder: (context, state) {
      // log.d('NetworkConnectionWrapperWidget.NetworkStatusBloc=$state');
      return (state.state == ConnectivityResult.none ||
              (state.hasDataConnection == null ||
                  state.hasDataConnection == false))
          ? NoNetworkScreen()
          : child;
    });
  }
}
