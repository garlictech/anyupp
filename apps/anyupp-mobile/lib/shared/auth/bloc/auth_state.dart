import 'package:equatable/equatable.dart';

abstract class BaseAuthState extends Equatable {
  const BaseAuthState();

  @override
  List<Object> get props => [];
}

class InitialAuthState extends BaseAuthState {
  const InitialAuthState();
}

class AuthStateChanged extends BaseAuthState {
  final bool authenticated;

  const AuthStateChanged(this.authenticated);

  @override
  List<Object> get props => [authenticated];
}

class AuthError extends BaseAuthState {
  final String code;
  final String message;

  AuthError(this.code, this.message);

  @override
  List<Object> get props => [code, message];
}
