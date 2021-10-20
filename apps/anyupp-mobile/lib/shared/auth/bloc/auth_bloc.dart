import 'dart:async';

import 'package:catcher/catcher.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<BaseAuthEvent, BaseAuthState> {
  final AuthRepository _authRepository;

  late StreamSubscription _authSubscription;

  AuthBloc(this._authRepository) : super(InitialAuthState()) {
    _authSubscription = _authRepository.getAuthenticatedUserProfileStream().listen(
      (user) {
        add(AuthStateChangedEvent(true));
      },
      onError: (error, stackTrace) {
        Catcher.reportCheckedError(error, stackTrace);
        add(AuthErrorEvent('AUTH_ERROR', error.message));
      },
    );
  }

  @override
  Stream<BaseAuthState> mapEventToState(BaseAuthEvent event) async* {
    if (event is AuthStateChangedEvent) {
      yield AuthStateChanged(event.authenticated);
    }
    if (event is AuthErrorEvent) {
      yield AuthError(event.code, event.message);
    }
  }

  @override
  Future<void> close() {
    _authSubscription.cancel();
    _authRepository.cancel();
    return super.close();
  }
}
