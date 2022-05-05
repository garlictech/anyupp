import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/exception.dart';
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
    return NetworkConnectionWrapperWidget(
      child: BlocListener<ExceptionBloc, ExceptionState>(
        listener: (BuildContext context, ExceptionState state) {
          if (state is ExceptionShowState) {
            print('Main.ExceptionState=$state');
            // Future.delayed(Duration(seconds: 1)).then((_) =>
            //     getIt<ExceptionBloc>().add(ShowException(state.exception)));
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
            // print('***** OnBoarding().state = ${snapshot?.data}, hasData = ${snapshot.hasData}');
            if (snapshot.hasData) {
              if (snapshot.data == 'AUTHENTICATED') {
                if (_authRepository.nextPageAfterLogin != null) {
                  Widget afterLoginWidget = _authRepository.nextPageAfterLogin!;
                  _authRepository.nextPageAfterLogin = null;
                  return afterLoginWidget;
                }

                return SelectUnitChooseMethodScreen();
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
    );
  }
}
