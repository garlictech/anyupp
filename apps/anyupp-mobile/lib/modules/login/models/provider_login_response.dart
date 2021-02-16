import 'package:fa_prev/shared/auth.dart';
import 'package:firebase_auth/firebase_auth.dart';


class ProviderLoginResponse {
  final AuthCredential credential;
  final User user;

  ProviderLoginResponse({
    this.credential,
    this.user,
  });

  @override
  String toString() => 'PorviderLoginResponse(credential: $credential, user: $user)';

  @override
  bool operator ==(Object o) {
    if (identical(this, o)) return true;

    return o is ProviderLoginResponse && o.credential == credential && o.user == user;
  }

  @override
  int get hashCode => credential.hashCode ^ user.hashCode;
}
