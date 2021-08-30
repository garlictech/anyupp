import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> setTokenPreferences(Response response, SharedPreferences _prefs) async {
  String token = response.data['token'];
  String tokenType = response.data['tokenType'];
  String refreshToken = response.data['refreshToken'];
  await _prefs.setString('token', token);
  await _prefs.setString('tokenType', tokenType);
  await _prefs.setString('refreshToken', refreshToken);
  print('setTokenPreferences[tokenType=$tokenType]');
  print('setTokenPreferences[token=$token.substring(0, 32)]');
  print('setTokenPreferences[refreshToken=$refreshToken.substring(0, 32)]');
}

void debugRequest(RequestOptions options) {
  print("--> ${options.method.toUpperCase()} ${"" + options.baseUrl + options.path}");
  print("Headers:");
  options.headers.forEach((k, v) => print('$k: $v'));
  print("queryParameters:");
  options.queryParameters.forEach((k, v) => print('$k: $v'));
  if (options.data != null) {
    print("BodyType: ${options.data?.runtimeType}");
    print("Body: ${options.data}");
  }
  print("--> END ${options.method.toUpperCase()}");
}

void debugResponse(Response response) {
  print("<-- ${response.statusCode} $response");
  print("Headers:");
  response.headers.forEach((k, v) => print('$k: $v'));
  print("ResponseType: ${response.data?.runtimeType}");
  print("Response: ${response.data}");
  print("<-- END HTTP");
}

void debugError(DioError dioError) {
  print("<-- ${dioError.message} ${dioError.error}");
  print("${dioError.response != null ? dioError.response?.data : 'Unknown Error'}");
  print("<-- End error");
}
