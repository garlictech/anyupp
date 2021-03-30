import 'dart:async';
import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth/service/cognito_service.dart';

import 'package:rxdart/rxdart.dart';

import 'auth_provider_interface.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  User _user;
  final CognitoService _service;

  AwsAuthProvider(this._service) {
    print('AwsAuthProvider().constructor()');
    getAuthenticatedUserProfile();
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    print('getAuthenticatedUserProfile().user=$_user');
    try {
      // AuthUser u = await Amplify.Auth.getCurrentUser();
      // print('getAuthenticatedUserProfile().getCurrentUser=$u');

      // _user = null;
      CognitoUserSession session = await _service.getSession;
      // CognitoAuthSession session = await Amplify.Auth.fetchAuthSession(
      //   options: CognitoSessionOptions(getAWSCredentials: false),
      // );
      print('getAuthenticatedUserProfile().session.isSignedIn=${session?.isValid()}');
      if (session == null) {
        _user = null;
        _userController.add(_user);
        return null;
      }
      if (session.isValid()) {
        if (session.idToken != null) {
          print('getAuthenticatedUserProfile().idToken=${session.idToken}');
          print('getAuthenticatedUserProfile().refreshToken=${session.refreshToken}');
          print('getAuthenticatedUserProfile().accessToken=${session.accessToken}');
        }

        if (_user == null) {
          CognitoUser user = await _service.currentUser;
          _user = _userFromAttributes(await user.getUserAttributes());
        } else {
          // don't need to call _userController.add(_user);
          return _user;
        }
      } else {
        _user = null;

      }
      print('getAuthenticatedUserProfile().final.user=$_user');
      _userController.add(_user);
      return _user;
    } on Exception catch (e) {
      print('getAuthenticatedUserProfile().exception=$e');
      _userController.add(null);
      return null;
    } on Error catch (e) {
      print('getAuthenticatedUserProfile().error=$e');
      _userController.add(null);
      return null;
    }
  }

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
    String email;
    String name;
    String subId;
    String loginMethod;
    for (int i = 0; i < attributes.length; i++) {
      CognitoUserAttribute a = attributes[i];
      // print('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.name == 'email') {
        email = a.value;
        name = email.split('@').first;
        continue;
      }
      if (a.name == 'sub') {
        // TODO
        subId = a.value;
        continue;
      }
      if (a.name == 'identities') {
        List<dynamic> json = jsonDecode(a.value);
        loginMethod = json.isNotEmpty
            ? json[0]['providerType']
            : 'UNKNOWN'; //LoginMethodUtils.stringToMethod(json[0]['providerType']);
        continue;
      }
    }
    User user = User(email: email, loginMethod: loginMethod, name: name, id: subId);
    return user;
  }

  @override
  Future<CognitoAccessToken> getAccessToken() async {
    try {
      return (await _service.getSession).accessToken;
    } on Exception catch (e) {
      print('***** getAccessToken().error=$e');
      return null;
    }
  }

  @override
  Future<CognitoIdToken> getIdToken() async {
    try {
      return (await _service.getSession).idToken;
    } on Exception catch (e) {
      print('***** getIdToken().error=$e');
      return null;
    }
  }

  bool isTokenValid(String token) {
    if (DateTime.now().add(Duration(minutes: 5)).isBefore(tokenExpiration(token))) {
      return true;
    }
    return false;
  }

  DateTime tokenExpiration(String token) {
    final parts = token.split('.');

    if (parts.length != 3) {
      throw GraphQLException(
        code: GraphQLException.CODE,
        subCode: 'AWS_INVALID_TOKEN',
        message: 'Token format not valid. Token must contains 3 part, separated by .(dot)!',
      );
    }

    final payloadMap = json.decode(_decodeBase64(parts[1]));

    if (payloadMap is! Map<String, dynamic>) {
      throw GraphQLException(
        code: GraphQLException.CODE,
        subCode: 'AWS_INVALID_TOKEN_PAYLOAD',
        message: 'Token payload is not valid. Token payload must a valid base64 encoded JSON string!',
      );
    }
    print('**** tokenExpiration.token=$token, exp=${payloadMap['exp'] * 1000}');

    return DateTime.fromMillisecondsSinceEpoch(payloadMap['exp'] * 1000);
  }

  String _decodeBase64(String str) {
    var output = str.replaceAll('-', '+').replaceAll('_', '/');

    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw GraphQLException(
          code: GraphQLException.CODE,
          subCode: 'AWS_INVALID Base64 String',
          message: 'Token is not in a valid base64 format!',
        );
    }

    return utf8.decode(base64Url.decode(output));
  }
}
