import 'dart:async';

import 'package:connectivity/connectivity.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:fa_prev/shared/connectivity.dart';

typedef ConnectivityCallback = Function(ConnectivityResult);

class NetworkConnectionWrapperWidget extends StatefulWidget {
  NetworkConnectionWrapperWidget({
    @required this.child,
    this.onConnectionChanged,
  }) : assert(child != null);

  final Widget child;
  final ConnectivityCallback onConnectionChanged;

  @override
  _NetworkConnectionWrapperWidgetState createState() => _NetworkConnectionWrapperWidgetState();
}

class _NetworkConnectionWrapperWidgetState extends State<NetworkConnectionWrapperWidget> {
  bool isOnline;
  StreamSubscription<ConnectivityResult> _subscription;

  @override
  void initState() {
    isOnline = true;

    // TODO ezt majd ki kellene vinni BloC-ba
    _subscription = Connectivity().onConnectivityChanged.listen((result) {
      print('NetworkConnectionWrapperWidget.state=$result');
      if (widget.onConnectionChanged != null) {
        widget.onConnectionChanged(result);
      }
      setState(() {
        if (result == ConnectivityResult.none) {
          isOnline = false;
        } else {
          isOnline = true;
        }
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return isOnline ? widget.child : NoNetworkScreen();
  }

  @override
  void dispose() {
    try {
      _subscription?.cancel();
    } on PlatformException catch (e) {
      print('**** NetworkHandler error: $e');
    }
    super.dispose();
  }
}
