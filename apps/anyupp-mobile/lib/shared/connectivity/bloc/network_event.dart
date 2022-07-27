import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:equatable/equatable.dart';

abstract class NetworkStatusEvent extends Equatable {
  const NetworkStatusEvent();
}

class NetworkConnectionChangedEvent extends NetworkStatusEvent {
  final ConnectivityResult state;
  final bool? hasDataConnection;
  final bool? showDialog;
  final bool? hideDialog;
  const NetworkConnectionChangedEvent(
      this.state, this.hasDataConnection, this.showDialog, this.hideDialog);

  @override
  List<Object?> get props => [state, hasDataConnection, showDialog, hideDialog];
}
