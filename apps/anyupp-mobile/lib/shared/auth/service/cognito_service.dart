import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:flutter/foundation.dart';
import 'cognito_local_storage.dart';

class CognitoService {
  final String region;
  final String userPoolId;
  final String clientId;
  final String identityPoolId;
  CognitoLocalStorage storage;

  CognitoUserPool _userPool;

  CognitoUser _cognitoUser;

  CognitoService(
      {@required this.region,
      @required this.identityPoolId,
      @required this.userPoolId,
      @required this.clientId,
      @required prefs}) {
    this.storage = CognitoLocalStorage(prefs);
    _userPool = CognitoUserPool(
      userPoolId,
      clientId,
      storage: storage,
    );
    init();
  }

  CognitoUserSession _userSession;

  CognitoUserSession get session => _userSession;

  CognitoUserPool get userPool => _userPool;

  Future<CognitoUser> get currentUser async {
    _cognitoUser = await _userPool.getCurrentUser();
    if (_cognitoUser != null) {
      _userSession = await _cognitoUser.getSession();
    }

    return _cognitoUser;
  }

  // Future<CognitoUserSession> get getSession async => (await currentUser)?.getSession();

  Future<bool> get isSessionValid async => (await session)?.isValid() ?? false;

  Future<void> init() async {
    await this.currentUser;
    _cognitoUser = await _userPool.getCurrentUser();
  }

  CognitoUser createCognitoUser(String username) {
    return CognitoUser(username, userPool);
  }

  AuthenticationDetails getAuthDetails(String username, String password) {
    return AuthenticationDetails(
      username: username,
      password: password,
    );
  }

  Future<bool> signOut() async {
    try {
      CognitoUser user = await this.currentUser;
      if (user != null) {
        await user.globalSignOut();
        await user.signOut();
      }

      return true;
    } on Exception catch (e) {
      print('signOut().error=$e');
      return false;
    }
  }

  Future<CognitoUser> createCognitoUserFromSession(
      CognitoUserSession session) async {
    final user = CognitoUser("external", userPool,
        signInUserSession: session, storage: storage);
    _userSession = session;
    return user;
  }

  Future<CognitoCredentials> loginWithCredentials(
      String accessToken, String provider) async {
    print('loginWithCredentials()=$provider, identityPoolId=$identityPoolId');
    CognitoCredentials credentials =
        CognitoCredentials(identityPoolId, userPool);
    await credentials.getAwsCredentials(accessToken, provider);
    print(
        'loginWithCredentials().credentials.userIdentityId=${credentials?.userIdentityId}');
    print(
        'loginWithCredentials().credentials.accessKeyId=${credentials?.accessKeyId}');
    print(
        'loginWithCredentials().credentials.secretAccessKey=${credentials?.secretAccessKey}');
    print(
        'loginWithCredentials().credentials.sessionToken=${credentials?.sessionToken}');
    // print('loginWithCredentials().userPool.getCurrentUser=${_userPool.getCurrentUser()}');

    // CognitoUser user = CognitoUser(credentials.userIdentityId, _userPool, storage: userPool.storage);

    // print('loginWithCredentials().user=$user');
    // AuthenticationDetails authDetails = AuthenticationDetails(
    //   username: credentials.userIdentityId,
    // );
    // // CognitoUserSession session = user.getSignInUserSession();
    // // await user.refreshSession(CognitoRefreshToken(credentials.sessionToken));
    // CognitoUserSession session = await user.authenticateUser(authDetails);
    // // CognitoUserSession session = await user.getSession();
    // print('loginWithCredentials().session=$session');

    // final idToken = CognitoIdToken(credentials.sessionToken);
    // final access2Token = CognitoAccessToken(accessToken);
    // final session = CognitoUserSession(idToken, access2Token);
    // final user = CognitoUser(null, userPool, signInUserSession: session);
    return credentials;
  }
}
