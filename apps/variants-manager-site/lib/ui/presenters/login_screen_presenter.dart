import '/ui/views/screens/dashboard_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../services/cognito_service.dart';
import '../viewmodels/login-screen-viewmodel.dart';

class LoginScreenPresenter extends StateNotifier<LoginScreenViewModel> {
  final CognitoService cognitoService;
  late final TextEditingController emailFieldController;
  late final TextEditingController passwordFieldController;
  final BuildContext context;

  LoginScreenPresenter(this.cognitoService, this.context)
      : super(LoginScreenViewModel()) {
    emailFieldController = TextEditingController();
    passwordFieldController = TextEditingController();
  }

  onLoginPressed() async {
    state = LoginScreenViewModel(loggingIn: true);
    final result = await cognitoService.loginWithEmail(
        emailFieldController.text, passwordFieldController.text);

    if (result) {
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (context) => DashboardScreen()));
    } else {
      await showDialog(
        context: context,
        builder: (alertDialogContext) {
          return AlertDialog(
            title: Text('Login error'),
            content: Text('Cannot log in'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(alertDialogContext),
                child: Text('Ok'),
              ),
            ],
          );
        },
      );
    }

    state = LoginScreenViewModel(loggingIn: false);
  }

  onClearEmailField() {
    emailFieldController.clear();
  }

  onTogglePasswordVisibility() {
    state = state.copyWith(passwordVisibility: !state.passwordVisibility);
  }
}

final loginWithEmailMVPProvider = StateNotifierProvider.autoDispose
    .family<LoginScreenPresenter, LoginScreenViewModel, BuildContext>(
        (ref, context) {
  final cognitoProvider = ref.watch(cognitoServiceProvider);
  return LoginScreenPresenter(cognitoProvider, context);
});
