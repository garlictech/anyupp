import 'package:connectivity/connectivity.dart';
import 'package:equatable/equatable.dart';

abstract class NetworkStatusEvent extends Equatable {
  const NetworkStatusEvent();
}

class NetworkConnectionChangedEvent extends NetworkStatusEvent {
  final ConnectivityResult state;
  final bool showDialog;
  final bool hideDialog;
  const NetworkConnectionChangedEvent(this.state, this.showDialog, this.hideDialog);

  @override
  List<Object> get props => [state, showDialog, hideDialog];
}
