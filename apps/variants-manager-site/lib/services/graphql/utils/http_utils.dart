import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

void debugError(DioError dioError) {
  debugPrint("<-- ${dioError.message} ${dioError.error}");
  debugPrint(
      "${dioError.response != null ? dioError.response?.data : 'Unknown Error'}");
  debugPrint("<-- End error");
}

void debugRequest(RequestOptions options) {
  debugPrint(
      "--> ${options.method.toUpperCase()} ${"" + options.baseUrl + options.path}");
  debugPrint("Headers:");
  options.headers.forEach((k, v) => debugPrint('$k: $v'));
  debugPrint("queryParameters:");
  options.queryParameters.forEach((k, v) => debugPrint('$k: $v'));
  if (options.data != null) {
    debugPrint("BodyType: ${options.data?.runtimeType}");
    debugPrint("Body: ${options.data}");
  }
  debugPrint("--> END ${options.method.toUpperCase()}");
}

void debugResponse(Response response) {
  debugPrint("<-- ${response.statusCode} $response");
  debugPrint("Headers:");
  response.headers.forEach((k, v) => debugPrint('$k: $v'));
  debugPrint("ResponseType: ${response.data?.runtimeType}");
  debugPrint("Response: ${response.data}");
  debugPrint("<-- END HTTP");
}

Future<void> setTokenPreferences(
    Response response, SharedPreferences _prefs) async {
  String token = response.data['token'];
  String tokenType = response.data['tokenType'];
  String refreshToken = response.data['refreshToken'];
  await _prefs.setString('token', token);
  await _prefs.setString('tokenType', tokenType);
  await _prefs.setString('refreshToken', refreshToken);
  debugPrint('setTokenPreferences[tokenType=$tokenType]');
  debugPrint('setTokenPreferences[token=$token.substring(0, 32)]');
  debugPrint(
      'setTokenPreferences[refreshToken=$refreshToken.substring(0, 32)]');
}
