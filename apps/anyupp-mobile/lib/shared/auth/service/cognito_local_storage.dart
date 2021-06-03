import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Extend CognitoStorage with Shared Preferences to persist account
/// login sessions
class CognitoLocalStorage extends CognitoStorage {
  SharedPreferences _prefs;
  CognitoLocalStorage();

  Future<SharedPreferences> get pref async {
    if (_prefs == null) {
      _prefs = await SharedPreferences.getInstance();
    }
    return _prefs;
  }

  @override
  Future getItem(String key) async {
    String item;
    try {
      item = json.decode((await pref).getString(key));
    } catch (e) {
      return null;
    }
    return item;
  }

  @override
  Future setItem(String key, value) async {
    await (await pref).setString(key, json.encode(value));
    return getItem(key);
  }

  @override
  Future removeItem(String key) async {
    final item = getItem(key);
    if (item != null) {
      await (await pref).remove(key);
      return item;
    }
    return null;
  }

  @override
  Future<void> clear() async {
    await (await pref).clear();
  }
}
