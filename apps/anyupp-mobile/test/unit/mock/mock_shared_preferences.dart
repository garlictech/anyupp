import 'package:mockito/mockito.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MockSharedPreferences extends Fake implements SharedPreferences {
  final Map<String, Object> _preferenceCache = {};

  bool? getBool(String key) => _preferenceCache[key] as bool?;

  Future<bool> setBool(String key, bool value) async {
    _preferenceCache[key] = value;
    return true;
  }

  Future<bool> remove(String key) async {
    _preferenceCache.remove(key);
    return true;
  }
}
