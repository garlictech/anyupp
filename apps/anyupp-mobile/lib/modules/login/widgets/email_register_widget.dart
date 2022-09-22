import '/core/core.dart';
import '/modules/login/login.dart';
import '/shared/exception.dart';
import '/shared/locale/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class EmailRegisterDialogContentWidget extends StatefulWidget {
  @override
  _EmailRegisterDialogContentWidgetState createState() =>
      _EmailRegisterDialogContentWidgetState();
}

class _EmailRegisterDialogContentWidgetState
    extends State<EmailRegisterDialogContentWidget> {
  final _emailController = TextEditingController();
  final _password1Controller = TextEditingController();
  final _password2Controller = TextEditingController();
  //final _emailOrPhoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _password1Controller.dispose();
    _password2Controller.dispose();
    //_emailOrPhoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {},
      child: BlocBuilder<LoginBloc, LoginState>(
          builder: (BuildContext context, LoginState state) {
        if (state is EmailRegistrationSuccess) {
          log.d('EmailRegisterDialogContentWidget.auth.bloc.state=$state');
          getIt<LoginBloc>().add(ChangeEmailFormUI(
              ui: LoginFormUI.SHOW_LOGIN_WITH_PASSWORD,
              animationCurve: Curves.easeIn));
        }
        // log.d('PhoneDialogContentWidget.bloc.state=$state');

        if (state is EmailLoginInProgress) {
          return _buildLoading(context);
        }

        return _buildRegistrationForm(context);
      }),
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

  Widget _buildRegistrationForm(BuildContext context) {
    return SingleChildScrollView(
      child: Form(
        key: _formKey,
        child: Stack(
          children: [
            Container(
              padding: EdgeInsets.only(top: 8.0, left: 12.0, right: 12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Email + passwords input fields
                  // LoginFormUtils.buildTextField(
                  //   context,
                  //   trans('login.email.emailFieldLabel'),
                  //   _emailOrPhoneController,
                  //   TextInputType.text,
                  //   false,
                  //   LoginFormUtils.emailValidator(context),
                  // ),
                  LoginFormUtils.buildTextField(
                    context,
                    trans('login.email.emailFieldLabel'),
                    _emailController,
                    TextInputType.emailAddress,
                    false,
                    LoginFormUtils.emailValidator(context),
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
                        //transEx(context, 'payment.sendOrder'),
                        trans('login.email.buttonRegister'),
                        style: Fonts.satoshi(
                          color: theme.secondary0,
                          fontSize: 20.0,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      onPressed: () => _sendRegistrationRequest(),
                    ),
                  ),
                ],
              ),
            ),
            // _buildCloseButton(context),
          ],
        ),
      ),
    );
  }

  void _sendRegistrationRequest() {
    log.d('_sendRegistrationRequest()=${_emailController.text}');
    if (_formKey.currentState != null && _formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      if (_password1Controller.text != _password2Controller.text) {
        getIt<ExceptionBloc>().add(ShowException(SignUpException(
            code: SignUpException.CODE,
            subCode: SignUpException.ERROR_PASSWORD_MISSMATCH)));
      } else {
        getIt<LoginBloc>().add(RegisterWithEmailAndPassword(
            userEmail: _emailController.text,
            userPhone: null,
            email: _emailController.text,
            password: _password1Controller.text));
      }
      // bool isPhone = false;
      // if (LoginFormUtils.phoneValidator(context)
      //         .call(_emailOrPhoneController.text) ==
      //     null) {
      //   isPhone = true;
      // }
      // bool isEmail = false;
      // if (LoginFormUtils.emailValidator(context)
      //         .call(_emailOrPhoneController.text) ==
      //     null) {
      //   isEmail = true;
      // }
      // if (!isPhone && !isEmail) {
      //   getIt<ExceptionBloc>().add(ShowException(SignUpException(
      //       code: SignUpException.CODE,
      //       subCode: SignUpException.NOT_EMAIL_OR_PHONE)));
      // } else if (isEmail &&
      //     (_emailOrPhoneController.text != _emailController.text)) {
      //   getIt<ExceptionBloc>().add(ShowException(SignUpException(
      //       code: SignUpException.CODE,
      //       subCode: SignUpException.USER_EMAIL_NOT_SAME)));
      // } else {
      //   getIt<LoginBloc>().add(RegisterWithEmailAndPassword(
      //       userEmail: isEmail ? _emailOrPhoneController.text : null,
      //       userPhone: isPhone ? _emailOrPhoneController.text : null,
      //       email: _emailController.text,
      //       password: _password1Controller.text));
      // }
    }
  }
}
