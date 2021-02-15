import 'package:equatable/equatable.dart';

abstract class BaseAuthEvent extends Equatable {
  const BaseAuthEvent();

  @override
  List<Object> get props => [];
}

class AuthStateChangedEvent extends BaseAuthEvent {
  final bool authenticated;

  const AuthStateChangedEvent(this.authenticated);
  @override
  List<Object> get props => [authenticated];
}

class AuthErrorEvent extends BaseAuthEvent {
  final String code;
  final String message;

  const AuthErrorEvent(this.code, this.message);

  @override
  List<Object> get props => [code, message];
}
