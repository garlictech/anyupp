import 'package:dio/dio.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'utils/http_utils.dart';

class DioTokenInterceptor extends InterceptorsWrapper {
  final Dio _dio;
  final IAuthProvider _provider;
  SharedPreferences _prefs;

  DioTokenInterceptor(this._dio, this._provider) {
    SharedPreferences.getInstance().then((preferences) => _prefs = preferences);
  }

  @override
  Future onRequest(RequestOptions options) async {
    // debugRequest(options);
    if (options.headers.containsKey('requirestoken')) {
      options.headers.remove('requirestoken');
      String accessToken = _prefs.getString('cognito_accesstoken');
      print('accessToken: $accessToken');
      options.headers.addAll({'Authorization': 'Bearer $accessToken'});
    }
    return options;
  }

  @override
  Future onResponse(Response response) async {
    // debugResponse(response);
    if (response.data['token'] != null) {
      // print('SAVING TOKENS!');
      await setTokenPreferences(response, _prefs);
      // print('TOKENS SAVED!');
    }
    return super.onResponse(response);
  }

  @override
  Future onError(DioError dioError) async {
    
    debugError(dioError);
    // return super.onError(dioError);

    int responseCode = dioError.response.statusCode;
    String oldAccessToken = _prefs.getString('cognito_accesstoken');
    if (oldAccessToken != null && responseCode == 401) {
      _dio.interceptors.requestLock.lock();
      _dio.interceptors.responseLock.lock();

      String refreshToken = _prefs.get('cognito_refreshtoken');
      if (refreshToken == null) {
         return super.onError(dioError);
      }
      print('==>Refresh token=' + refreshToken);

      await _provider.getAuthenticatedUserProfile();

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
