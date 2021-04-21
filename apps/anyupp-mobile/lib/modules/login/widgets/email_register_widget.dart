import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class EmailRegisterDialogContentWidget extends StatefulWidget {
  @override
  _EmailRegisterDialogContentWidgetState createState() =>
      _EmailRegisterDialogContentWidgetState();
}

class _EmailRegisterDialogContentWidgetState
    extends State<EmailRegisterDialogContentWidget> {
  final _emailController = TextEditingController();
  final _password1Controller = TextEditingController();
  final _emailOrPhoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _password1Controller.dispose();
    _emailOrPhoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
        print('EmailRegisterDialogContentWidget.auth.bloc.state=$state');
        if (state is EmailRegistrationSuccess) {
          getIt<LoginBloc>().add(ChangeEmailFormUI(
              ui: LoginFormUI.SHOW_LOGIN_WITH_PASSWORD,
              animationCurve: Curves.easeIn));
        }
      },
      child: BlocBuilder<LoginBloc, LoginState>(
          builder: (BuildContext context, LoginState state) {
        // print('PhoneDialogContentWidget.bloc.state=$state');

        if (state is LoginInProgress) {
          return _buildLoading(context,
              message: trans('login.email.loginProgress'));
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

  Widget _buildRegistrationForm(BuildContext context) {
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
                    // Email + passwords input fields
                    LoginFormUtils.buildTextField(
                      context,
                      trans('login.email.emailOrPhoneFieldLabel'),
                      _emailOrPhoneController,
                      TextInputType.text,
                      true,
                      LoginFormUtils.emailOrPhoneValidator(context),
                    ),
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
                          trans('login.email.buttonRegister'),
                          style: GoogleFonts.poppins(
                            color: theme.text2,
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
      ),
    );
  }

  void _sendRegistrationRequest() {
    print('_sendRegistrationRequest()=${_emailController.text}');
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      getIt<LoginBloc>().add(RegisterWithEmailAndPassword(
          _emailController.text, _password1Controller.text));
    }
  }
}
