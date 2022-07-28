import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '/services/cognito_service.dart';
import 'package:functional_data/functional_data.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

part 'auth-state.g.dart';

@FunctionalData()
class AuthState extends $AuthState {
  final String? username;

  AuthState({
    this.username,
  });
}

class AuthStateNotifier extends StateNotifier<AuthState> {
  AuthStateNotifier(Future<CognitoUser?> currentUser) : super(AuthState()) {
    currentUser.then((user) => state = AuthState(username: user?.username));
  }
}

final authStateProvider =
    StateNotifierProvider<AuthStateNotifier, AuthState>((ref) {
  final user =
      ref.watch(cognitoServiceProvider.select((value) => value.currentUser));
  return AuthStateNotifier(user);
});
