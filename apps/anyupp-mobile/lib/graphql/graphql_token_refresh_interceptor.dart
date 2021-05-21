import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'utils/http_utils.dart';

class DioTokenInterceptor extends InterceptorsWrapper {
  final Dio _dio;
  SharedPreferences _prefs;

  DioTokenInterceptor(this._dio) {
    SharedPreferences.getInstance().then((preferences) => _prefs = preferences);
  }

  @override
  Future onRequest(RequestOptions options) async {
    debugRequest(options);
    if (options.headers.containsKey('requirestoken')) {
      options.headers.remove('requirestoken');
      print('accessToken: ${_prefs.get('token')}');
      String accessToken = _prefs.get('token');
      options.headers.addAll({'Authorization': 'Bearer $accessToken'});
    }
    return options;
  }

  @override
  Future onResponse(Response response) async {
    debugResponse(response);
    if (response.data['token'] != null) {
      print('SAVING TOKENS!');
      await setTokenPreferences(response, _prefs);
      print('TOKENS SAVED!');
    }
    return super.onResponse(response);
  }

  @override
  Future onError(DioError dioError) async {
    
    debugError(dioError);
    // return super.onError(dioError);

    int responseCode = dioError.response.statusCode;
    String oldAccessToken = _prefs.get('token');
    if (oldAccessToken != null && responseCode == 401) {
      _dio.interceptors.requestLock.lock();
      _dio.interceptors.responseLock.lock();

      String refreshToken = _prefs.get('refreshToken');
      if (refreshToken == null) {
         return super.onError(dioError);
      }
      print('==>Refresh token=' + refreshToken);

      // Response response = await _dio.put(URL_ROOT + 'auth/refresh', data: {
      //   'refresh_token': refreshToken
      // });

      // setTokenPreferences(response, _prefs);

      RequestOptions options = dioError.response.request;
      options.headers.addAll({'requiresToken': true});
      _dio.interceptors.requestLock.unlock();
      _dio.interceptors.responseLock.unlock();
      return _dio.request(options.path, options: options);
    } else {
      return super.onError(dioError);
    }
  }
}
