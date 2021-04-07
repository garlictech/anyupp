import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:flutter/material.dart';

import 'splash_screen.dart';

class OnBoarding extends StatefulWidget {
  @override
  _OnBoardingState createState() => _OnBoardingState();
}

class _OnBoardingState extends State<OnBoarding> {
  final AuthRepository _authRepository = getIt<AuthRepository>();

  @override
  Widget build(BuildContext context) {
    print('***** OnBoarding().build()');
    return NetworkConnectionWrapperWidget(
      child: StreamBuilder<String>(
        stream: _authRepository
            .getAuthenticatedUserProfileStream()
            .map((event) => event == null ? 'NOT_AUTHENTICATED' : "AUTHENTICATED"),
        //.delay(Duration(seconds: 2)),
        builder: (context, snapshot) {
          print('***** OnBoarding().state = ${snapshot?.data}, hasData = ${snapshot.hasData}');
          if (snapshot.hasData) {
            if (snapshot.data == 'AUTHENTICATED') {
              if (_authRepository.nextPageAfterLogin != null) {
                return _authRepository.nextPageAfterLogin;
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
