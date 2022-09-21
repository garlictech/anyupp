import 'package:auto_size_text/auto_size_text.dart';
import '/core/core.dart';
import '/modules/login/login.dart';
import '/shared/locale/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PasswordResetWidget extends StatefulWidget {
  @override
  _PasswordResetWidgetState createState() => _PasswordResetWidgetState();
}

class _PasswordResetWidgetState extends State<PasswordResetWidget> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoginBloc, LoginState>(
      builder: (BuildContext context, LoginState state) {
        if (state is LoginInProgress) {
          return _buildLoading(context,
              message: trans('login.email.sendPasswordResetMessage'));
        }

        if (state is PasswordResetInProgress) {
          return _buildLoading(context);
        }
        if (state is PasswordResetInfoSentState) {
          return _buildEmailSentInfo(
              context, state.userName, state.deliveryMedium, state.destination);
        }

        return _buildResetPasswordForm(context);
      },
    );
  }

  Widget _buildLoading(BuildContext context, {String message = '...'}) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CenterLoadingWidget(
            backgroundColor: Colors.white,
          ),
          Text(
            message,
            style: Fonts.satoshi(
              fontSize: 16.0,
              fontWeight: FontWeight.w500,
              color: Color(0xFF3C2F2F),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildEmailSentInfo(BuildContext context, String userName,
      String deliveryMedium, String destination) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(
          padding: EdgeInsets.all(12.0),
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: Text(
                  trans('login.email.dialogResetSentTitle'),
                  textAlign: TextAlign.left,
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
              ),
              // Phone number input field
              AutoSizeText(
                trans('login.email.dialogResetSentMessage') + destination,
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 18.0,
                ),
              ),
              InkWell(
                onTap: () {
                  getIt<LoginBloc>().add(ChangeEmailFormUI(
                      ui: LoginFormUI.SHOW_PASSWORD_CONFIRM,
                      animationCurve: Curves.easeIn));
                  getIt<LoginBloc>().add(PasswordResetInfoSent(
                      userName, deliveryMedium, destination));
                },
                child: Text(
                  trans('login.email.enterCode'),
                  textAlign: TextAlign.start,
                  style: Fonts.satoshi(
                    fontSize: 18,
                    color: theme.highlight,
                    fontWeight: FontWeight.normal,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              // Buttons
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildResetPasswordForm(BuildContext context) {
    return SingleChildScrollView(
      child: Form(
        key: _formKey,
        child: Stack(
          children: [
            Container(
              padding: EdgeInsets.only(top: 8.0, left: 12.0, right: 12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Email + passwords input fields
                  LoginFormUtils.buildTextField(
                    context,
                    trans('login.email.emailFieldLabel'),
                    _emailController,
                    TextInputType.emailAddress,
                    false,
                    LoginFormUtils.emailOrPhoneValidator(context),
                  ),
                  // Sing in link button
                  InkWell(
                    onTap: () {
                      getIt<LoginBloc>().add(ChangeEmailFormUI(
                          ui: LoginFormUI.SHOW_LOGIN_WITH_PASSWORD,
                          animationCurve: Curves.easeIn));
                    },
                    child: Text(
                      trans('login.email.linkSignIn'),
                      textAlign: TextAlign.start,
                      style: Fonts.satoshi(
                        fontSize: 14,
                        color: theme.highlight,
                        fontWeight: FontWeight.normal,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 8.0,
                  ),

                  // Buttons
                  SizedBox(
                    width: double.infinity,
                    height: 52.0,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF30BF60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                      ),
                      child: Text(
                        trans('login.email.buttonPasswordReset'),
                        style: Fonts.satoshi(
                          color: theme.secondary0,
                          fontSize: 20.0,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      onPressed: () => _sendPasswordResetEmail(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _sendPasswordResetEmail() {
    log.d('_sendPasswordResetEmail()=${_emailController.text}');
    if (_formKey.currentState != null && _formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      getIt<LoginBloc>().add(SendPasswordResetEmail(_emailController.text));
    }
  }
}
