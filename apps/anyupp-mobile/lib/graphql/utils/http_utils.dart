import 'package:dio/dio.dart';
import '/core/core.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> setTokenPreferences(
    Response response, SharedPreferences _prefs) async {
  String token = response.data['token'];
  String tokenType = response.data['tokenType'];
  String refreshToken = response.data['refreshToken'];
  await _prefs.setString('token', token);
  await _prefs.setString('tokenType', tokenType);
  await _prefs.setString('refreshToken', refreshToken);
  log.d('setTokenPreferences[tokenType=$tokenType]');
  log.d('setTokenPreferences[token=$token.substring(0, 32)]');
  log.d('setTokenPreferences[refreshToken=$refreshToken.substring(0, 32)]');
}

void debugRequest(RequestOptions options) {
  log.d(
      "--> ${options.method.toUpperCase()} ${"" + options.baseUrl + options.path}");
  log.d("Headers:");
  options.headers.forEach((k, v) => log.d('$k: $v'));
  log.d("queryParameters:");
  options.queryParameters.forEach((k, v) => log.d('$k: $v'));
  if (options.data != null) {
    log.d("BodyType: ${options.data?.runtimeType}");
    log.d("Body: ${options.data}");
  }
  log.d("--> END ${options.method.toUpperCase()}");
}

void debugResponse(Response response) {
  log.d("<-- ${response.statusCode} $response");
  log.d("Headers:");
  response.headers.forEach((k, v) => log.d('$k: $v'));
  log.d("ResponseType: ${response.data?.runtimeType}");
  log.d("Response: ${response.data}");
  log.d("<-- END HTTP");
}

void debugError(DioError dioError) {
  log.d("<-- ${dioError.message} ${dioError.error}");
  log.d(
      "${dioError.response != null ? dioError.response?.data : 'Unknown Error'}");
  log.d("<-- End error");
}
