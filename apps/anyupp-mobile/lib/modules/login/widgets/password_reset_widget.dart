import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/login/models/sign_up_exception.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class PasswordResetDialogContentWidget extends StatefulWidget {
  @override
  _PasswordResetDialogContentWidgetState createState() =>
      _PasswordResetDialogContentWidgetState();
}

class _PasswordResetDialogContentWidgetState
    extends State<PasswordResetDialogContentWidget> {
  final _codeController = TextEditingController();
  final _password1Controller = TextEditingController();
  final _password2Controller = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _codeController.dispose();
    _password1Controller.dispose();
    _password2Controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
      },
      child: BlocBuilder<LoginBloc, LoginState>(
          builder: (BuildContext context, LoginState state) {
        // print('PhoneDialogContentWidget.bloc.state=$state');
        if (state is PasswordResetInfoSentState) {
          return _buildRegistrationForm(context, state.userName);
        }
        if (state is PasswordReset) {
          return _buildPasswordResetInfo(context);
        }

        return _buildLoading(context);
      }),
    );
  }

  Widget _buildLoading(BuildContext context, {String message = '...'}) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CenterLoadingWidget(),
          Text(
            message,
            style: GoogleFonts.poppins(
              fontSize: 16.0,
              fontWeight: FontWeight.w500,
              color: Color(0xFF3C2F2F),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildPasswordResetInfo(BuildContext context) {
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
                  trans('login.email.dialogPasswordRefreshedTitle'),
                  textAlign: TextAlign.left,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
              ),
              // Phone number input field
              Container(
                  margin: EdgeInsets.only(top: 16.0, bottom: 16.0),
                  child: Text(
                    trans('login.email.dialogPasswordRefreshedMessage'),
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      fontSize: 18.0,
                    ),
                  )),
              InkWell(
                onTap: () {
                  getIt<LoginBloc>().add(ChangeEmailFormUI(
                      ui: LoginFormUI.SHOW_LOGIN_WITH_PASSWORD,
                      animationCurve: Curves.easeIn));
                },
                child: Text(
                  trans('login.email.signIn'),
                  textAlign: TextAlign.start,
                  style: GoogleFonts.poppins(
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

  Widget _buildRegistrationForm(BuildContext context, String userName) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Stack(
            children: [
              Container(
                padding: EdgeInsets.only(top: 8.0, left: 12.0, right: 12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LoginFormUtils.buildTextField(
                      context,
                      trans('login.email.verificationCode'),
                      _codeController,
                      TextInputType.emailAddress,
                      false,
                      LoginFormUtils.confirmCodeValidator(context),
                    ),
                    LoginFormUtils.buildTextField(
                      context,
                      trans('login.email.passwordFieldLabel'),
                      _password1Controller,
                      TextInputType.text,
                      true,
                      LoginFormUtils.passwordValidator(context),
                    ),
                    LoginFormUtils.buildTextField(
                      context,
                      trans('login.email.password2FieldLabel'),
                      _password2Controller,
                      TextInputType.text,
                      true,
                      LoginFormUtils.passwordValidator(context),
                    ),
                    InkWell(
                      onTap: () {
                        getIt<LoginBloc>().add(ChangeEmailFormUI(
                            ui: LoginFormUI.SHOW_LOGIN_WITH_PASSWORD,
                            animationCurve: Curves.easeIn));
                      },
                      child: Text(
                        trans('login.email.linkSignIn'),
                        textAlign: TextAlign.start,
                        style: GoogleFonts.poppins(
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
                          primary: Color(0xFF30BF60),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                        ),
                        child: Text(
                          //transEx(context, 'payment.sendOrder'),
                          trans('login.email.buttonPasswordReset'),
                          style: GoogleFonts.poppins(
                            color: theme.text2,
                            fontSize: 20.0,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        onPressed: () => _sendRegistrationRequest(userName),
                      ),
                    ),
                  ],
                ),
              ),
              // _buildCloseButton(context),
            ],
          ),
        ),
      ),
    );
  }

  void _sendRegistrationRequest(String userName) {
    print('_sendRegistrationRequest()=${_codeController.text}');
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      bool passwordsMatch = false;
      if (_password2Controller.text == _password2Controller.text) {
        passwordsMatch = true;
      }

      if (!passwordsMatch) {
        getIt<ExceptionBloc>().add(ShowException(LoginException(
            code: LoginException.CODE,
            subCode: LoginException.ERROR_PASSWORD_MISMATCH)));
      } else {
        getIt<LoginBloc>().add(ConfirmPassword(
            userName: userName,
            code: _codeController.text,
            password: _password1Controller.text));
      }
    }
  }
}
