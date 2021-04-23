import 'dart:async';
import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';

import 'package:rxdart/rxdart.dart';

import 'auth_provider_interface.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  User _user;
  CognitoUser _cognitoUser;
  final CognitoService _service;

  AwsAuthProvider(this._service) {
    print('AwsAuthProvider().constructor()');
    getAuthenticatedUserProfile();
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    try {
      // CognitoUser user = await _service.currentUser;
      print('getAuthenticatedUserProfile().user=$_user');
      if (_user != null) {
        return _user;
      }
      if (_user == null) {
        _cognitoUser = null;
        _user = null;
        _userController.add(null);
        return null;
      }
      return _user;
    } on Exception catch (e) {
      print('getAuthenticatedUserProfile().exception=$e');
      _user = null;
      _cognitoUser = null;
      _userController.add(null);
      return null;
    } on Error catch (e) {
      print('getAuthenticatedUserProfile().error=$e');
      _user = null;
      _cognitoUser = null;
      _userController.add(null);
      return null;
    }
  }

  @override
  Future<User> loginWithCognitoSession(CognitoUserSession session) async {
    print('loginWithCognitoSession().session=$session');
    try {
      _cognitoUser = await _service.createCognitoUserFromSession(session);
      print('loginWithCognitoSession().cognitoUser=$_cognitoUser');
      _user = _userFromAttributes(await _cognitoUser.getUserAttributes());
      print('loginWithCognitoSession().user=$_user');
      _userController.add(_user);
    } on Exception catch (e) {
      print('loginWithCognitoSession().error=$e');
      _cognitoUser = null;
      _user = null;
      _userController.add(_user);
    }
    return _user;
  }

  // Future<void> setCredentials(User user, CognitoCredentials credentials) async {
  //   _credentials = credentials;
  //   _user = user;
  //   _userController.add(_user);
  //   return _user;
  // }

  // @override
  // Future<User> getAuthenticatedUserProfile() async {
  //   // print('getAuthenticatedUserProfile().user=$_user');
  //   try {
  //     AuthUser user = await Amplify.Auth.getCurrentUser();
  //     print('getAuthenticatedUserProfile().user=${user?.userId}, name=${user?.username}');
  //     if (user != null && _user != null) {
  //       return _user;
  //     }

  //     CognitoAuthSession session = await Amplify.Auth.fetchAuthSession(
  //       options: CognitoSessionOptions(getAWSCredentials: false),
  //     );
  //     print('getAuthenticatedUserProfile().session.isSignedIn=${session.isSignedIn}');

  //     if (session.isSignedIn) {
  //       if (_user != null) {
  //         return _user;
  //       }
  //       session = await Amplify.Auth.fetchAuthSession(
  //         options: CognitoSessionOptions(getAWSCredentials: true),
  //       );
  //     }
  //     print('getAuthenticatedUserProfile().session.sessionToken=${session.credentials?.sessionToken}');
  //     print('getAuthenticatedUserProfile().session.identityId=${session.identityId}');
  //     print('getAuthenticatedUserProfile().session.userSub=${session.userSub}');
  //     print('getAuthenticatedUserProfile().session.refreshToken=${session.userPoolTokens?.refreshToken}');
  //     if (!session.isSignedIn) {
  //       _user = null;
  //     } else {
  //       List<AuthUserAttribute> attributes = await Amplify.Auth.fetchUserAttributes();
  //       _user = _userFromAttributes(attributes);
  //     }
  //     _userController.add(_user);
  //     print('getAuthenticatedUserProfile()._userController=$_userController');
  //     print('getAuthenticatedUserProfile().user=$_user');
  //     return _user;
  //   } on Exception catch (e) {
  //     print('getAuthenticatedUserProfile().exception=$e');
  //     _userController.add(null);
  //     return null;
  //   } on Error catch (e) {
  //     print('getAuthenticatedUserProfile().error=$e');
  //     _userController.add(null);
  //     return null;
  //   }
  // }

  @override
  Stream<User> getAuthenticatedUserProfileStream() => _userController.stream;

  @override
  Future<void> cancel() async {
    // await _subscription.cancel();
    await _userController.close();
  }

  Future<void> triggerSingInSuccess() async {
    await getAuthenticatedUserProfile();
  }

  User _userFromAttributes(List<CognitoUserAttribute> attributes) {
    String email, name, id, login;

    for (int i = 0; i < attributes.length; i++) {
      CognitoUserAttribute a = attributes[i];
      //print('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.name == 'email') {
        email = a.value;
        name = email.split('@').first;
        continue;
      }
      if (a.name == 'sub') {
        id = a.value;
        continue;
      }
      if (a.name == 'identities') {
        List<dynamic> json = jsonDecode(a.value);
        login = json[0]['providerType'];
        continue;
      }
    }
    User user = User(
      id: id,
      email: email,
      name: name,
      loginMethod: login,
    );
    return user;
  }

  // User _userFromAttributes(List<CognitoUserAttribute> attributes) {
  //   String email;
  //   String name;
  //   String subId;
  //   String loginMethod;
  //   for (int i = 0; i < attributes.length; i++) {
  //     CognitoUserAttribute a = attributes[i];
  //     // print('\t attr[${a.userAttributeKey}]=${a.value}');
  //     if (a.name == 'email') {
  //       email = a.value;
  //       name = email.split('@').first;
  //       continue;
  //     }
  //     if (a.name == 'sub') {
  //       // TODO
  //       subId = a.value;
  //       continue;
  //     }
  //     if (a.name == 'identities') {
  //       List<dynamic> json = jsonDecode(a.value);
  //       loginMethod = json.isNotEmpty
  //           ? json[0]['providerType']
  //           : 'UNKNOWN'; //LoginMethodUtils.stringToMethod(json[0]['providerType']);
  //       continue;
  //     }
  //   }
  //   User user = User(email: email, loginMethod: loginMethod, name: name, id: subId);
  //   return user;
  // }

  @override
  Future<String> getAccessToken() async {
    print('***** getAccessToken()');
    try {
      CognitoUserSession session = await _service.session;
      print('***** getAccessToken().session=$session');
      return session?.accessToken?.jwtToken;
    } on Exception catch (e) {
      print('***** getAccessToken().error=$e');
      return null;
    }
  }

  @override
  Future<String> getIdToken() async {
    try {
      CognitoUserSession session = await _service.session;
      return session?.idToken?.jwtToken;
    } on Exception catch (e) {
      print('***** getIdToken().error=$e');
      return null;
    }
  }

  @override
  Future<void> clearUserSession() async {
    _user = null;
    _cognitoUser = null;
    _userController.add(_user);
  }
}
