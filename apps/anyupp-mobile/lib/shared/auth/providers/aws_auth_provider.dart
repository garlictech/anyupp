import 'dart:async';
import 'dart:convert';

import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
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
      // print('getAuthenticatedUserProfile().session.sessionToken=${session.credentials?.sessionToken}');
      // print('getAuthenticatedUserProfile().session.identityId=${session.identityId}');
      // print('getAuthenticatedUserProfile().session.userSub=${session.userSub}');
      // print('getAuthenticatedUserProfile().session.refreshToken=${session.userPoolTokens?.refreshToken}');
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
        loginMethod = json.isNotEmpty ? json[0]['providerType'] : 'UNKNOWN';//LoginMethodUtils.stringToMethod(json[0]['providerType']);
        continue;
      }
    }
    User user = User(
      email: email,
      loginMethod: loginMethod,
      name: name,
      id: subId
    );
    return user;
  }
}
