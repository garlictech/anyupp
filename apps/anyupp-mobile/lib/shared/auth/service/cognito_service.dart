// import 'package:amazon_cognito_identity_dart_2/cognito.dart';
// import 'package:flutter/foundation.dart';

// import 'cognito_local_storage.dart';

// class CognitoService {
//   final String region;
//   final String userPoolId;
//   final String clientId;
//   final String identityPoolId;

//   CognitoUserPool _userPool;

//   CognitoService({@required this.region, @required this.identityPoolId, @required this.userPoolId, @required this.clientId}) {
//     _userPool = CognitoUserPool(
//       userPoolId,
//       clientId,
//       storage: CognitoLocalStorage('anyupp:'),
//     );
//   }

//   CognitoUserPool get userPool => _userPool;

//   Future<CognitoUser> get currentUser async => _userPool?.getCurrentUser();

//   Future<CognitoUserSession> get getSession async => (await currentUser)?.getSession();

//   Future<bool> get isSessionValid async => (await getSession)?.isValid() ?? false;

//   CognitoUser createCognitoUser(String username) {
//     return CognitoUser(username, userPool);
//   }

//   AuthenticationDetails getAuthDetails(String username, String password) {
//     return AuthenticationDetails(
//       username: username,
//       password: password,
//     );
//   }

//   Future<CognitoCredentials> loginWithCredentials(String accessToken, String provider) async {
//     print('loginWithCredentials()=$provider');
//     CognitoCredentials credentials = CognitoCredentials(identityPoolId, userPool);
//     await credentials.getAwsCredentials(accessToken, provider);
//     print('loginWithCredentials().credentials.userIdentityId=${credentials?.userIdentityId}');
//     print('loginWithCredentials().credentials.accessKeyId=${credentials?.accessKeyId}');
//     print('loginWithCredentials().credentials.secretAccessKey=${credentials?.secretAccessKey}');
//     print('loginWithCredentials().credentials.sessionToken=${credentials?.sessionToken}');
//     print('loginWithCredentials().userPool.getCurrentUser=${_userPool.getCurrentUser()}');

//     CognitoUser user = CognitoUser(credentials.userIdentityId, _userPool, storage: userPool.storage);
    
   
//     print('loginWithCredentials().user=$user');
//     AuthenticationDetails authDetails = AuthenticationDetails(
//       username: credentials.userIdentityId,
//     );
//     // CognitoUserSession session = user.getSignInUserSession();
//     // await user.refreshSession(CognitoRefreshToken(credentials.sessionToken));
//     CognitoUserSession session = await user.authenticateUser(authDetails);
//     // CognitoUserSession session = await user.getSession();
//     print('loginWithCredentials().session=$session');

//     // final idToken = CognitoIdToken(credentials.sessionToken);
//     // final access2Token = CognitoAccessToken(accessToken);
//     // final session = CognitoUserSession(idToken, access2Token);
//     // final user = CognitoUser(null, userPool, signInUserSession: session);

//     return credentials;
//   }
// }
