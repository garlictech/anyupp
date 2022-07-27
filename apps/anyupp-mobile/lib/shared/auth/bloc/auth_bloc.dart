import 'dart:async';

import 'package:catcher/catcher.dart';
import '/shared/auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthBloc extends Bloc<BaseAuthEvent, BaseAuthState> {
  final AuthRepository _authRepository;

  late StreamSubscription _authSubscription;

  AuthBloc(this._authRepository) : super(InitialAuthState()) {
    _authSubscription =
        _authRepository.getAuthenticatedUserProfileStream().listen(
      (user) {
        add(AuthStateChangedEvent(true));
      },
      onError: (error, stackTrace) {
        Catcher.reportCheckedError(error, stackTrace);
        add(AuthErrorEvent('AUTH_ERROR', error.message));
      },
    );
    on<AuthStateChangedEvent>(
      (event, emit) => emit(AuthStateChanged(event.authenticated)),
    );
    on<AuthErrorEvent>(
      (event, emit) => emit(AuthError(event.code, event.message)),
    );
  }

  @override
  Future<void> close() {
    _authSubscription.cancel();
    _authRepository.cancel();
    return super.close();
  }
}
