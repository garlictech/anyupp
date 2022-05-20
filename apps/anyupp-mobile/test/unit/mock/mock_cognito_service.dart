import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '../../test_logger.dart';

class MockCognitoService {
  final String region = 'eu-west-1';
  final String userPoolId = 'dummy-user-pool-id';
  final String clientId = 'dummy-client-id';
  final String identityPoolId = 'dummy-identity-pool-id';

  MockCognitoService() {
    _cognitoUser = CognitoUser(
      'test',
      // ignore: null_check_always_fails
      null!,
    );
  }

  late CognitoUser? _cognitoUser;

  CognitoUserSession? _userSession;

  CognitoUserSession? get session => _userSession;

  CognitoUserPool? get userPool => null;

  Future<CognitoUser?> get currentUser async {
    return _cognitoUser;
  }

  // Future<CognitoUserSession> get getSession async => (await currentUser)?.getSession();

  Future<bool> get isSessionValid async => true;

  CognitoUser createCognitoUser(String username) {
    return CognitoUser(username, userPool!);
  }

  AuthenticationDetails getAuthDetails(String username, String password) {
    return AuthenticationDetails(
      username: username,
      password: password,
    );
  }

  Future<bool> signOut() async {
    return true;
  }

  Future<CognitoUser?> createCognitoUserFromSession(
      CognitoUserSession session, String userName) async {
    return _cognitoUser;
  }

  Future<bool> refreshUserToken() async {
    return true;
  }

  Future<CognitoCredentials> loginWithCredentials(
      String accessToken, String provider) async {
    tlog.d('loginWithCredentials()=$provider, identityPoolId=$identityPoolId');
    CognitoCredentials credentials =
        CognitoCredentials(identityPoolId, userPool!);
    return credentials;
  }
}
