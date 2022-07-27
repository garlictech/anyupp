import '/app-config.dart';
import '/core/core.dart';
import '/modules/screens.dart';
import '/shared/auth.dart';
import '/shared/connectivity.dart';
import '/shared/exception.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rxdart/rxdart.dart';

class OnBoarding extends StatefulWidget {
  @override
  _OnBoardingState createState() => _OnBoardingState();
}

class _OnBoardingState extends State<OnBoarding> {
  final AuthRepository _authRepository = getIt<AuthRepository>();

  @override
  Widget build(BuildContext context) {
    return LogConsoleOnShake(
      debugOnly: true,
      enabled: AppConfig.Stage != 'prod',
      child: NetworkConnectionWrapperWidget(
        child: BlocListener<ExceptionBloc, ExceptionState>(
          listener: (BuildContext context, ExceptionState state) {
            if (state is ExceptionShowState) {
              showExceptionDialog(context, state.exception);
            }
          },
          child: StreamBuilder<String>(
            stream: _authRepository
                .getAuthenticatedUserProfileStream()
                .map((event) =>
                    event == null ? 'NOT_AUTHENTICATED' : "AUTHENTICATED")
                .delay(Duration(milliseconds: 100)),
            builder: (context, snapshot) {
              // log.d('***** OnBoarding().state = ${snapshot?.data}, hasData = ${snapshot.hasData}');
              if (snapshot.hasData) {
                if (snapshot.data == 'AUTHENTICATED') {
                  if (_authRepository.nextPageAfterLogin != null) {
                    Widget afterLoginWidget =
                        _authRepository.nextPageAfterLogin!;
                    _authRepository.nextPageAfterLogin = null;
                    return afterLoginWidget;
                  }

                  // return SelectUnitChooseMethodScreen();
                  // return SelectUnitScreen();
                  return HomeScreen();
                } else {
                  // Not authenticated
                  return LoginScreen();
                }
              } else {
                // Loading...
                return SplashScreen();
              }
            },
          ),
        ),
      ),
    );
  }
}
