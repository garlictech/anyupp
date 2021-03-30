import 'package:fa_prev/models.dart';

class ProviderLoginResponse {
  // TODO AWS remove
  final dynamic credential;
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
