import 'dart:math';

import 'package:dio/dio.dart';
import '/core/core.dart';
import '/shared/auth/auth.dart';
import '/shared/connectivity/bloc/network_event.dart';
import '/shared/connectivity/bloc/network_status_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'utils/http_utils.dart';

class DioTokenInterceptor extends QueuedInterceptorsWrapper {
  final Dio _dio;
  final IAuthProvider _provider;
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  DioTokenInterceptor(this._dio, this._provider);

  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    if (options.headers.containsKey('requirestoken')) {
      options.headers.remove('requirestoken');
      String? accessToken = (await _prefs).getString('cognito_accesstoken');
      log.d('accessToken: $accessToken');
      options.headers.addAll({'Authorization': 'Bearer $accessToken'});
    }
    handler.next(options);
    // super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) async {
    if (response.data['token'] != null) {
      // log.d('SAVING TOKENS!');
      await setTokenPreferences(response, (await _prefs));
      // log.d('TOKENS SAVED!');
    }
    handler.next(response);
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
      handler.reject(dioError);
    }
  }

  _handleRetriableError(
      DioError dioError, ErrorInterceptorHandler handler) async {
    log.d('_handleRetriableError()=$dioError');
    log.d('_handleRetriableError().response=${dioError.response}');
    log.d('_handleRetriableError().response.data=${dioError.response?.data}');
    log.d('_handleRetriableError().headers=${dioError.requestOptions.headers}');
    bool isRetriable = dioError.response?.data?['error']?['retryable'] ==
            true ||
        dioError.response?.data?['error']?['originalResponse']?['retryable'] ==
            true;
    log.d('_handleRetriableError().isRetriable=$isRetriable');
    if (isRetriable) {
      int retryCount = dioError.requestOptions.headers['retryCount'] ?? 0;
      log.d('_handleRetriableError().retryCount=$retryCount');
      if (retryCount == 0) {
        handler.reject(dioError);
        return;
      }

      double r = dioError.response?.data?['error']?['retryDelay'] ??
          dioError.response?.data?['error']?['originalResponse']
              ?['retryDelay'] ??
          0;
      int retryDelay = (r * 1000).toInt();
      log.d('_handleRetriableError().retryDelay=$retryDelay');
      if (retryDelay != 0) {
        log.d('_handleRetriableError().waiting $retryDelay ms...');
        await Future<void>.delayed(Duration(
          milliseconds: retryDelay,
        ));
      }

      RequestOptions options = dioError.requestOptions;
      options.headers.addAll({'retryCount': max(retryCount - 1, 0)});
      await _dio.fetch<void>(options).then((value) => handler.resolve(value),
          onError: (e) => handler.reject(e));
    } else {
      handler.reject(dioError);
    }
  }

  void _handleNetworkError(
      DioError dioError, ErrorInterceptorHandler handler) async {
    NetworkStatusBloc networkStatusBloc = getIt<NetworkStatusBloc>();
    var status = networkStatusBloc.getLastConnectivityResult();
    if (status != null) {
      networkStatusBloc
          .add((NetworkConnectionChangedEvent(status, false, true, false)));
    }
    handler.next(dioError);
  }

  void _handleTokenRefresh(
      DioError dioError, ErrorInterceptorHandler handler) async {
    String? refreshToken = (await _prefs).getString('cognito_refreshtoken');
    if (refreshToken == null) {
      return handler.reject(dioError);
    }
    log.d('==>Refresh token=' + refreshToken);

    await _provider.getAuthenticatedUserProfile();

    RequestOptions options = dioError.response!.requestOptions;
    options.headers.addAll({'requiresToken': true});
    await _dio.request(options.path, data: options);
  }
}
