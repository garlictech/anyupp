import 'package:dio/dio.dart';
import '/app-config.dart';
import '/graphql/graphql_token_refresh_interceptor.dart';
import '/shared/auth/auth.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http_mock_adapter/http_mock_adapter.dart';
import 'package:mockito/mockito.dart';

import '../fixtures.dart';

class MockAuthProvider extends Mock implements IAuthProvider {}

void main() {
  late Dio dio;
  late DioAdapter dioAdapter;

  group('Test DIO interceptor for AWS error retry...', () {
    setUpAll(() async {
      dio = Dio(BaseOptions(
        baseUrl: AppConfig.UserPoolDomain,
      ));
      dio.interceptors.add(
        DioTokenInterceptor(
          dio,
          MockAuthProvider(),
        ),
      );
      dioAdapter = DioAdapter(dio: dio);
    });

    test('Success test', () async {
      const userCredentials = <String, dynamic>{
        'email': testUserEmail,
        'password': testUserPassword,
      };

      dioAdapter.onPost(
        '/login',
        (server) => server.reply(200, {
          'token': 'TEST_TOKEN',
          'tokenType': 'TEST_TOKEN_TYPE',
          'refreshToken': 'TEST_REFRESH_TOKEN',
        }),
        data: userCredentials,
      );

      var response = await dio.post('/login', data: userCredentials);
      expect(response.statusCode, 200);
    });

    test('Server error test', () async {
      const userCredentials = <String, dynamic>{
        'email': testUserEmail,
        'password': testUserPassword,
      };

      var error = DioError(
        requestOptions: RequestOptions(
          path: '/login',
        ),
        response: Response(
          requestOptions: RequestOptions(
            path: '/login',
          ),
          data: {
            "error": {
              "statusCode": 400,
              "exception": "UsernameExistsException",
              "message": "An account with the given email already exists.",
              "crashInfo": {
                "id": "postLogin:cognito/createUser/",
                "file": "postLogin",
                "context": "cognito",
                "action": "createUser",
                "detail": "",
                "extra": ""
              },
              "stage": "dev",
              "retryable": true,
              "originalResponse": {
                "message": "An account with the given email already exists.",
                "code": "UsernameExistsException",
                "time": "2021-09-12T11:27:04.425Z",
                "requestId": "e3166818-f5b7-43c4-8d7a-389f4d804764",
                "statusCode": 400,
                "retryable": true,
                "retryDelay": 3.52543038416525
              }
            },
            "exception": "UsernameExistsException",
            "message": "An account with the given email already exists.",
            "statusCode": 400,
            "timestamp": "2021-09-12T11:27:04.426Z",
            "path": "/v1/auth/login"
          },
        ),
      );

      dioAdapter.onPost(
        '/login',
        (server) => server.throws(400, error),
        data: userCredentials,
      );

      expect(
        () async => await dio.post('/login', data: userCredentials),
        throwsA(isA<DioError>()),
      );
    });

    test('Retry error test', () async {
      const userCredentials = <String, dynamic>{
        'email': testUserEmail,
        'password': testUserPassword,
      };
      dioAdapter.onPost(
        '/login',
        (server) => server.reply(400, {
          "error": {
            "statusCode": 400,
            "exception": "UsernameExistsException",
            "message": "An account with the given email already exists.",
            "crashInfo": {
              "id": "postLogin:cognito/createUser/",
              "file": "postLogin",
              "context": "cognito",
              "action": "createUser",
              "detail": "",
              "extra": ""
            },
            "stage": "dev",
            "retryable": true,
            "originalResponse": {
              "message": "An account with the given email already exists.",
              "code": "UsernameExistsException",
              "time": "2021-09-12T11:27:04.425Z",
              "requestId": "e3166818-f5b7-43c4-8d7a-389f4d804764",
              "statusCode": 400,
              "retryable": true,
              "retryDelay": 3.52543038416525
            }
          },
          "exception": "UsernameExistsException",
          "message": "An account with the given email already exists.",
          "statusCode": 400,
          "timestamp": "2021-09-12T11:27:04.426Z",
          "path": "/v1/auth/login"
        }),
        data: userCredentials,
      );
      dioAdapter.onPost(
          '/login',
          (server) => server.reply(400, {
                "error": {
                  "statusCode": 400,
                  "exception": "UsernameExistsException",
                  "message": "An account with the given email already exists.",
                  "crashInfo": {
                    "id": "postLogin:cognito/createUser/",
                    "file": "postLogin",
                    "context": "cognito",
                    "action": "createUser",
                    "detail": "",
                    "extra": ""
                  },
                  "stage": "dev",
                  "retryable": true,
                  "originalResponse": {
                    "message": "An account with the given email already exists.",
                    "code": "UsernameExistsException",
                    "time": "2021-09-12T11:27:04.425Z",
                    "requestId": "e3166818-f5b7-43c4-8d7a-389f4d804764",
                    "statusCode": 400,
                    "retryable": true,
                    "retryDelay": 3.52543038416525
                  }
                },
                "exception": "UsernameExistsException",
                "message": "An account with the given email already exists.",
                "statusCode": 400,
                "timestamp": "2021-09-12T11:27:04.426Z",
                "path": "/v1/auth/login"
              }),
          data: userCredentials,
          headers: {'retryCount': 1});
      expect(
        () async => await dio.post('/login', data: userCredentials),
        throwsException,
        // throwsA(isA<DioError>()),
      );
      // expect(response.statusCode, 400);
    });

    tearDownAll(() async {
      dio.close();
    });
  });
}
