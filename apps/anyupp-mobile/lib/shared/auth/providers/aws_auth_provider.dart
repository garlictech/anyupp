import 'dart:async';
import 'dart:io';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:path_provider/path_provider.dart';
import 'package:rxdart/rxdart.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AwsAuthProvider implements IAuthProvider {
  StreamController<User?> _userController = BehaviorSubject<User?>();
  User? _user;
  final CognitoService _service;

  AwsAuthProvider(this._service) {
    // log.d('AwsAuthProvider().constructor()');
    getAuthenticatedUserProfile();
  }

  @override
  Future<User?> getAuthenticatedUserProfile() async {
    try {
      bool isLooggedIn = await _service.refreshUserToken();
      // log.d('getAuthenticatedUserProfile().isLoggedIn=$isLooggedIn, user=$_user');
      if (isLooggedIn) {
        if (_user == null) {
          CognitoUser? user = await _service.currentUser;
          if (user != null) {
            _user = await _userFromAttributes(user);
          }
        }
      } else {
        if (_user != null) {
          _user = null;
        }
      }
      _userController.add(_user);
      return _user;
    } on Exception catch (e) {
      log.e('getAuthenticatedUserProfile().exception=$e');
      _user = null;
      _userController.add(null);
      return null;
    } on Error catch (e) {
      log.e('getAuthenticatedUserProfile().error=$e');
      _user = null;
      _userController.add(null);
      return null;
    }
  }

  @override
  Future<User?> loginWithCognitoSession(
      CognitoUserSession session, String username) async {
    // log.d('loginWithCognitoSession().session=$session, username=$username');
    try {
      CognitoUser? user =
          await _service.createCognitoUserFromSession(session, username);
      await user.cacheTokens();
      // log.d('loginWithCognitoSession().cognitoUser=${user.username}');
      _user = await _userFromAttributes(user);
      // log.d('loginWithCognitoSession().user=$_user');
      // await _service.createCognitoUserFromSession(session, _user.id);
      _userController.add(_user);
    } on Exception catch (e) {
      log.e('loginWithCognitoSession().error=$e');
      _user = null;
      _userController.add(_user);
    }
    return _user;
  }

  @override
  Stream<User?> getAuthenticatedUserProfileStream() => _userController.stream;

  @override
  Future<void> cancel() async {
    // await _subscription.cancel();
    await _userController.close();
  }

  Future<void> triggerSingInSuccess() async {
    await getAuthenticatedUserProfile();
  }

  Future<User?> _userFromAttributes(CognitoUser cognitoUser) async {
    String? email;
    String? name;
    String? phone;
    List<CognitoUserAttribute>? attributes =
        await cognitoUser.getUserAttributes();

    log.d('_userFromAttributes().start()');
    for (int i = 0; attributes != null && i < attributes.length; i++) {
      CognitoUserAttribute a = attributes[i];
      log.d('\tattr[${a.name}]=${a.value}');
      if (a.name != null && a.name == 'name') {
        name = a.value;
        // if (name == null || name.startsWith('anonymuser')) {
        //   name = 'AnonymUser';
        // }
      }
      // log.d('\t attr[${a.userAttributeKey}]=${a.value}');
      if (a.name != null && a.name == 'email') {
        email = a.value;
        // name = email.split('@').first;
      }

      if (a.name != null && a.name == 'phone_number') {
        phone = a.value;
      }
    }
    if (name == null && email != null) {
      name = email.split('@').first;
    }

    CognitoUserSession? session = await cognitoUser.getSession();

    if (session != null) {
      CognitoIdToken idToken = session.idToken;
      dynamic payload = idToken.decodePayload();
      String username = payload['cognito:username'];
      log.i('loginWithCognitoSession().username=' + username);
      User user = User(email: email, name: name, id: username, phone: phone);
      return user;
    }
    return null;
  }

  @override
  Future<String?> getAccessToken() async {
    try {
      CognitoUserSession? session = await _service.session;
      if (session == null || !session.isValid()) {
        session = await (await _service.currentUser)?.getSession();
      }
      return session?.accessToken.jwtToken;
    } on Exception catch (e) {
      log.e('***** getAccessToken().error=$e');
      return null;
    }
  }

  @override
  Future<String?> getIdToken() async {
    try {
      CognitoUserSession? session = await _service.session;
      return session?.idToken.jwtToken;
    } on Exception catch (e) {
      log.e('***** getIdToken().error=$e');
      return null;
    }
  }

  @override
  Future<void> clearUserSession() async {
    _user = null;
    _userController.add(_user);
    log.i('clearUserSession().start()');
    try {
      SharedPreferences sp = await SharedPreferences.getInstance();
      await sp.clear();
      log.d('clearUserSession().deleting.sharedpreferences.done()');
      await _deleteCacheDir();
      log.d('clearUserSession().deleting.cachedir.done()');
      await _deleteAppDir();
      log.d('clearUserSession().deleting.appdir.done()');

      await CookieManager.instance().deleteAllCookies();
      log.d('clearUserSession().deleting.browser-cookies.done()');

      var webStorageManager = WebStorageManager.instance();
      if (Platform.isAndroid) {
        await webStorageManager.android.deleteAllData();
        log.d('clearUserSession().deleting.browser-storage.done()');
      }
      if (Platform.isIOS) {
        var records = await webStorageManager.ios
            .fetchDataRecords(dataTypes: IOSWKWebsiteDataType.values);
        var recordsToDelete = <IOSWKWebsiteDataRecord>[];
        for (var record in records) {
          recordsToDelete.add(record);
        }
        await webStorageManager.ios.removeDataFor(
            dataTypes: IOSWKWebsiteDataType.values,
            dataRecords: recordsToDelete);
        log.d('clearUserSession().deleting.browser-storage.done()');
      }
      log.i('clearUserSession().done()');
    } on Exception catch (e) {
      log.e('clearUserSession().exception=$e');
    } on Error catch (e) {
      log.e('clearUserSession().error=$e');
    }
  }

  Future<void> _deleteCacheDir() async {
    final cacheDir = await getTemporaryDirectory();
    log.d('_deleteCacheDir()=$cacheDir');

    if (cacheDir.existsSync()) {
      cacheDir.deleteSync(recursive: true);
    }
  }

  Future<void> _deleteAppDir() async {
    final appDir = await getApplicationSupportDirectory();
    log.d('_deleteAppDir()=$appDir');

    if (appDir.existsSync()) {
      appDir.deleteSync(recursive: true);
    }
  }
}
