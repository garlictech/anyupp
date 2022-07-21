import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:equatable/equatable.dart';

class NetworkState extends Equatable {
  final ConnectivityResult state;
  final bool? hasDataConnection;
  final bool? showDialog;
  final bool? hideDialog;

  const NetworkState(
      this.state, this.hasDataConnection, this.showDialog, this.hideDialog);

  @override
  List<Object?> get props => [state, showDialog, hideDialog];

  @override
  String toString() {
    return 'NetworkState[state=$state, showDialog=$showDialog, hideDialog=$hideDialog]';
  }
}
