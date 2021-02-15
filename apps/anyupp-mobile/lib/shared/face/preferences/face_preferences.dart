import 'package:shared_preferences/shared_preferences.dart';

class FacePreferences {
  static Future<bool> setGender(String gender) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.setString('FACE_GENDER', gender);
  }

  static Future<String> getGender() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('FACE_GENDER');
  }

  static Future<bool> setAge(String gender) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.setString('FACE_AGE', gender);
  }

  static Future<String> getAge() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('FACE_AGE');
  }

  static Future<void> clear() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('FACE_GENDER');
    await prefs.remove('FACE_AGE');
  }
}
