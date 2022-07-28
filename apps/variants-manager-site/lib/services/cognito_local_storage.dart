import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CognitoLocalStorage extends CognitoStorage {
  SharedPreferences? _prefs;
  CognitoLocalStorage();

  Future<SharedPreferences> get pref async {
    if (_prefs == null) {
      _prefs = await SharedPreferences.getInstance();
    }
    return _prefs!;
  }

  @override
  Future getItem(String key) async {
    try {
      String? v = (await pref).getString(key);
      if (v != null) {
        return json.decode(v);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  @override
  Future setItem(String key, value) async {
    await (await pref).setString(key, json.encode(value));
    return getItem(key);
  }

  @override
  Future removeItem(String key) async {
    final item = getItem(key);
    await (await pref).remove(key);
    return item;
  }

  @override
  Future<void> clear() async {
    await (await pref).clear();
  }
}
