import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/widgets/confirm_signup_widget.dart';
import 'package:fa_prev/modules/login/widgets/password_reset_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

typedef LoginPageViewIndexChangedCallback = void Function({int selectedIndex});

class EmailLoginPageViewWidget extends StatefulWidget {
  @override
  _EmailLoginPageViewWidgetState createState() =>
      _EmailLoginPageViewWidgetState();
}

class _EmailLoginPageViewWidgetState extends State<EmailLoginPageViewWidget> {
  final PageController _pageController = PageController(initialPage: 2);

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
        if (state is EmailFormUIChange) {
          log.d('EmailLoginPageViewWidget.state=$state');
          setPage(state);
        }
      },
      child: PageView(
        physics: NeverScrollableScrollPhysics(),
        controller: _pageController,
        children: [
          PasswordResetDialogContentWidget(),
          PasswordResetWidget(),
          EmailLoginDialogContentWidget(),
          EmailRegisterDialogContentWidget(),
          ConfirmSignUpWidget(),
        ],
      ),
    );
  }

  void setPage(EmailFormUIChange state) {
    int index = 0;
    switch (state.ui) {
      case LoginFormUI.SHOW_PASSWORD_CONFIRM:
        index = 0;
        break;
      case LoginFormUI.SHOW_FORGOT_PASSWORD:
        index = 1;
        break;
      case LoginFormUI.SHOW_LOGIN_WITH_PASSWORD:
        index = 2;
        break;
      case LoginFormUI.SHOW_REGISTRATION:
        index = 3;
        break;

      case LoginFormUI.SHOW_CONFIRM_SIGNUP:
        index = 4;
        break;
    }
    log.d(
        'setPage().page=$index, duration=${state.animationDuration}, curve=${state.animationCurve}');

    _pageController.animateToPage(
      index,
      duration: state.animationDuration ?? Duration(milliseconds: 350),
      curve: state.animationCurve ?? Curves.elasticIn,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}
