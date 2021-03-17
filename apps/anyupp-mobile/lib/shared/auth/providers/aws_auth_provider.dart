import 'dart:async';
import 'dart:convert';

import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';

import 'package:rxdart/rxdart.dart';

import 'auth_provider_interface.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User> _userController = BehaviorSubject<User>();
  // StreamSubscription _subscription;
  User _user;

  AwsAuthProvider() {
    print('AwsAuthProvider().constructor()');
    //_userController.add(null);
    getAuthenticatedUserProfile();
    // if (_subscription == null) {
    //   _subscription = Amplify.Hub.listen([HubChannel.Auth], (hubEvent) async {
    //     print('AwsAuthProvider().Amplify.Hub.listen=$hubEvent, eventName=${hubEvent.eventName}');
    //     switch (hubEvent.eventName) {
    //       case 'SIGNED_IN':
    //         {
    //           print('AwsAuthProvider().USER IS SIGNED IN');
    //           AuthUser cognitoUser = await Amplify.Auth.getCurrentUser();
    //           List<AuthUserAttribute> attributes = await Amplify.Auth.fetchUserAttributes();
    //           print('AwsAuthProvider().userAttributes:');
    //           if (attributes != null) {
    //             for (int i = 0; i < attributes.length; i++) {
    //               AuthUserAttribute a = attributes[i];
    //               print('\t attr[${a.userAttributeKey}]=${a.value}');
    //               // if (a.userAttributeKey == 'email') {

    //               // }
    //             }
    //           }
    //           _authController.add(AuthenticatedUser(id: cognitoUser.userId, displayName: cognitoUser.username));
    //           _userController.add(User(id: cognitoUser.userId, name: cognitoUser.username));
    //         }
    //         break;
    //       case 'SIGNED_OUT':
    //         {
    //           print('AwsAuthProvider().USER IS SIGNED OUT');
    //           _authController.add(null);
    //           _userController.add(null);
    //         }
    //         break;
    //       case 'SESSION_EXPIRED':
    //         {
    //           print('AwsAuthProvider().USER IS SIGNED IN');
    //           _authController.add(null);
    //           _userController.add(null);
    //         }
    //         break;
    //     }
    //   });
    // }
  }

  @override
  Future<User> getAuthenticatedUserProfile() async {
    print('getAuthenticatedUserProfile().user=$_user');
    try {
      // AuthUser u = await Amplify.Auth.getCurrentUser();
      // print('getAuthenticatedUserProfile().getCurrentUser=$u');

      // _user = null;
      CognitoAuthSession session = await Amplify.Auth.fetchAuthSession(
        options: CognitoSessionOptions(getAWSCredentials: false),
      );
      print('getAuthenticatedUserProfile().session.isSignedIn=${session.isSignedIn}');
      if (session.isSignedIn && _user == null) {
        session = await Amplify.Auth.fetchAuthSession(
          options: CognitoSessionOptions(getAWSCredentials: true),
        );
      }
      // print('getAuthenticatedUserProfile().session.credentials.sessionToken=${session.credentials?.sessionToken}');
      // print('getAuthenticatedUserProfile().session.identityId=${session.identityId}');
      // print('getAuthenticatedUserProfile().session.userSub=${session.userSub}');
      // print('getAuthenticatedUserProfile().session.userPoolTokens.refreshToken=${session.userPoolTokens?.refreshToken}');
      // print('getAuthenticatedUserProfile().session.userPoolTokens.accessToken=${session.userPoolTokens?.accessToken}');
      if (!session.isSignedIn) {
        _user = null;
      } else {
        if (_user != null) {
          // _userController.add(_user);
          return _user;
        }
        List<AuthUserAttribute> attributes = await Amplify.Auth.fetchUserAttributes();
        _user = _userFromAttributes(attributes);
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

  User _userFromAttributes(List<AuthUserAttribute> attributes) {
    String email;
    String name;
    String subId;
    String loginMethod;
    for (int i = 0; i < attributes.length; i++) {
      AuthUserAttribute a = attributes[i];
      // print('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.userAttributeKey == 'email') {
        email = a.value;
        name = email.split('@').first;
        continue;
      }
      if (a.userAttributeKey == 'sub') {
        // TODO
        subId = a.value;
        continue;
      }
      if (a.userAttributeKey == 'identities') {
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
  Future<String> getAccessToken() async {
    try {
      CognitoAuthSession session = await Amplify.Auth.fetchAuthSession(
        options: CognitoSessionOptions(getAWSCredentials: true),
      );
      print('***** getAcceddToken()=${session.userPoolTokens?.accessToken}');
      // if (isTokenValid(session.userPoolTokens.accessToken)) {
      //  return session.userPoolTokens?.accessToken;
      // } 
      return session.userPoolTokens?.accessToken;
    } on Exception catch (e) {
      print('***** getAcceddToken().error=$e');
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
      throw GraphQLException(code: GraphQLException.CODE, subCode: 'AWS_INVALID_TOKEN', message: 'Token format not valid. Token must contains 3 part, separated by .(dot)!',);
    }

    final payloadMap = json.decode(_decodeBase64(parts[1]));

    if (payloadMap is! Map<String, dynamic>) {
      throw GraphQLException(code: GraphQLException.CODE, subCode: 'AWS_INVALID_TOKEN_PAYLOAD', message: 'Token payload is not valid. Token payload must a valid base64 encoded JSON string!',);
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
        throw GraphQLException(code: GraphQLException.CODE, subCode: 'AWS_INVALID Base64 String', message: 'Token is not in a valid base64 format!',);
    }

    return utf8.decode(base64Url.decode(output));
  }
}
