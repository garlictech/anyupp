
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';

import 'splash_screen.dart';

class OnBoarding extends StatefulWidget {
  @override
  _OnBoardingState createState() => _OnBoardingState();
}

class _OnBoardingState extends State<OnBoarding> {

  final AuthRepository _authService = getIt<AuthRepository>();

  @override
  Widget build(BuildContext context) {
    return NetworkConnectionWrapperWidget(
      // child: LoginScreen(),
      child: StreamBuilder<String>(
        stream: _authService
            .getAuthenticatedUser()
            .map((event) => event == null ? 'NOT_AUTHENTICATED' : "AUTHENTICATED")
            .delay(Duration(seconds: 2)),
        builder: (context, snapshot) {
          print('***** OnBoarding().state = ${snapshot?.data}, hasData = ${snapshot.hasData}');
          if (snapshot.hasData) {
            if (snapshot.data == 'AUTHENTICATED') {

              if (_authService.nextPageAfterLogin != null) {
                return _authService.nextPageAfterLogin;
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
    );
  }
}
