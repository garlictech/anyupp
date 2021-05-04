import 'dart:convert';

import 'package:amazon_cognito_identity_dart_2/cognito.dart';

Map<String, String> _storage = {};

class CognitoLocalStorage extends CognitoStorage {
  String prefix;
  CognitoLocalStorage(this.prefix);

  @override
  Future setItem(String key, value) async {
    _storage[prefix + key] = json.encode(value);
    return _storage[prefix + key];
  }

  @override
  Future getItem(String key) async {
    if (_storage[prefix + key] != null) {
      return json.decode(_storage[prefix + key]);
    }
    return null;
  }

  @override
  Future removeItem(String key) async {
    return _storage.remove(prefix + key);
  }

  @override
  Future<void> clear() async {
    _storage = {};
  }
}
