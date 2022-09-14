import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '/models.dart';
import 'package:flutter/foundation.dart';

@immutable
class ProviderLoginResponse {
  final CognitoUserSession? credential;
  final User? user;

  ProviderLoginResponse({
    this.credential,
    this.user,
  });

  ProviderLoginResponse copyWith({
    CognitoUserSession? credential,
    User? user,
  }) {
    return ProviderLoginResponse(
      credential: credential ?? this.credential,
      user: user ?? this.user,
    );
  }

  @override
  String toString() => 'ProviderLoginResponse(credential: $credential, user: $user)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ProviderLoginResponse && other.credential == credential && other.user == user;
  }

  @override
  int get hashCode => credential.hashCode ^ user.hashCode;
}
