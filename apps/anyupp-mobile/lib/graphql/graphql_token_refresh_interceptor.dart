import 'dart:math';

import 'package:dio/dio.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:fa_prev/shared/connectivity/bloc/network_event.dart';
import 'package:fa_prev/shared/connectivity/bloc/network_status_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'utils/http_utils.dart';

class DioTokenInterceptor extends InterceptorsWrapper {
  final Dio _dio;
  final IAuthProvider _provider;
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  DioTokenInterceptor(this._dio, this._provider);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    if (options.headers.containsKey('requirestoken')) {
      options.headers.remove('requirestoken');
      String? accessToken = (await _prefs).getString('cognito_accesstoken');
      print('accessToken: $accessToken');
      options.headers.addAll({'Authorization': 'Bearer $accessToken'});
    }
    super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) async {
    if (response.data['token'] != null) {
      // print('SAVING TOKENS!');
      await setTokenPreferences(response, (await _prefs));
      // print('TOKENS SAVED!');
    }
    super.onResponse(response, handler);
  }

  @override
  void onError(DioError dioError, ErrorInterceptorHandler handler) async {
    debugError(dioError);
    int responseCode = dioError.response?.statusCode ?? 0;
    String? oldAccessToken = (await _prefs).getString('cognito_accesstoken');
    if (oldAccessToken != null && responseCode == 401) {
      _handleTokenRefresh(dioError, handler);
    } else if (dioError.message.contains("Failed host lookup")) {
      _handleNetworkError(dioError, handler);
    } else if (dioError.type == DioErrorType.response) {
      _handleRetriableError(dioError, handler);
    } else {
      super.onError(dioError, handler);
    }
  }

  _handleRetriableError(DioError dioError, ErrorInterceptorHandler handler) async {
    print('_handleRetriableError()=$dioError');
    bool isRetriable = dioError.response?.data?['error']?['retryable'] == true ||
        dioError.response?.data?['error']?['originalResponse']?['retryable'] == true;
    print('_handleRetriableError().isRetriable=$isRetriable');
    if (isRetriable) {
      int retryCount = dioError.requestOptions.headers['retryCount'] ?? 1;
      print('_handleRetriableError().retryCount=$retryCount');
      if (retryCount == 0) {
        super.onError(dioError, handler);
        return;
      }

      _dio.interceptors.requestLock.lock();
      _dio.interceptors.responseLock.lock();

      double r = dioError.response?.data?['error']?['retryDelay'] ??
          dioError.response?.data?['error']?['originalResponse']?['retryDelay'] ??
          0;
      int retryDelay = (r * 1000).toInt();
      print('_handleRetriableError().retryDelay=$retryDelay');
      if (retryDelay != 0) {
        print('_handleRetriableError().waiting $retryDelay ms...');
        await Future<void>.delayed(Duration(
          milliseconds: retryDelay,
        ));
      }

      RequestOptions options = dioError.response!.requestOptions;
      options.headers.addAll({'retryCount': max(retryCount - 1, 0)});
      _dio.interceptors.requestLock.unlock();
      _dio.interceptors.responseLock.unlock();

      print('_handleRetriableError().start HTTP call...');
      await _dio
          .fetch<void>(dioError.requestOptions)
          .then((value) => handler.resolve(value), onError: (e) => handler.reject(e));
      return;
    }

    super.onError(dioError, handler);
  }

  void _handleNetworkError(DioError dioError, ErrorInterceptorHandler handler) async {
    NetworkStatusBloc networkStatusBloc = getIt<NetworkStatusBloc>();
    var status = networkStatusBloc.getLastConnectivityResult();
    if (status != null) {
      networkStatusBloc.add((NetworkConnectionChangedEvent(status, false, true, false)));
    }
    super.onError(dioError, handler);
  }

  void _handleTokenRefresh(DioError dioError, ErrorInterceptorHandler handler) async {
    _dio.interceptors.requestLock.lock();
    _dio.interceptors.responseLock.lock();

    String? refreshToken = (await _prefs).getString('cognito_refreshtoken');
    if (refreshToken == null) {
      return super.onError(dioError, handler);
    }
    print('==>Refresh token=' + refreshToken);

    await _provider.getAuthenticatedUserProfile();

    RequestOptions options = dioError.response!.requestOptions;
    options.headers.addAll({'requiresToken': true});
    _dio.interceptors.requestLock.unlock();
    _dio.interceptors.responseLock.unlock();
    await _dio.request(options.path, data: options);
  }
}
