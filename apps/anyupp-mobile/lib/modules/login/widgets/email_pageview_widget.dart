import 'package:fa_prev/modules/login/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

typedef LoginPageViewIndexChangedCallback = void Function({int selectedIndex});

class EmailLoginPageViewWidget extends StatefulWidget {
  @override
  _EmailLoginPageViewWidgetState createState() => _EmailLoginPageViewWidgetState();
}

class _EmailLoginPageViewWidgetState extends State<EmailLoginPageViewWidget> {
  final PageController _pageController = PageController(initialPage: 0);

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
        if (state is EmailFormUIChange) {
          print('EmailLoginPageViewWidget.state=$state');
          setPage(state);
        }
      },
      child: PageView(
        physics: NeverScrollableScrollPhysics(),
        controller: _pageController,
        children: [
          EmailLoginDialogContentWidget(),
          EmailRegisterDialogContentWidget(),
          PasswordResetWidget(),
        ],
      ),
    );
  }

  void setPage(EmailFormUIChange state) {
    int index = 0;
    switch (state.ui) {
      case LoginFormUI.SHOW_LOGIN_WITH_PASSWORD:
        index = 0;
        break;
      case LoginFormUI.SHOW_REGISTRATION:
        index = 1;
        break;
      case LoginFormUI.SHOW_FORGOT_PASSWORD:
        index = 2;
        break;
    }
    print('setPage().page=$index, duration=${state.animationDuration}, curve=${state.animationCurve}');

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
