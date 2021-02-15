import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

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
          return _buildLoading(context, message: trans('login.email.sendPasswordResetMessage'));
        }

        if (state is PasswordResetEmailSent) {
          return _buildEmailSentInfo(context);
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

  Widget _buildResetPasswordForm(BuildContext context) {
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
                      trans('login.email.emailFieldLabel'),
                      _emailController,
                      TextInputType.emailAddress,
                      false,
                      LoginFormUtils.emailValidator(context),
                    ),
                    // Sing in link button
                    InkWell(
                      onTap: () {
                        getIt<LoginBloc>().add(
                            ChangeEmailFormUI(ui: LoginFormUI.SHOW_LOGIN_WITH_LINK, animationCurve: Curves.easeIn));
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
                      child: RaisedButton(
                        child: Text(
                          trans('login.email.buttonPasswordReset'),
                          style: GoogleFonts.poppins(
                            color: theme.text2,
                            fontSize: 20.0,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        color: Color(0xFF30BF60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
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
      ),
    );
  }

  Widget _buildEmailSentInfo(BuildContext context) {
    return Stack(
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
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
              ),
              // Phone number input field
              Center(
                child: Container(
                    margin: EdgeInsets.only(top: 16.0, bottom: 26.0),
                    child: Text(
                      trans('login.email.dialogResetSentMessage'),
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 18.0,
                      ),
                    )),
              ),
              // Buttons
            ],
          ),
        ),
      ],
    );
  }

  void _sendPasswordResetEmail() {
    print('_sendPasswordResetEmail()=${_emailController.text}');
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      getIt<LoginBloc>().add(SendPasswordResetEmail(_emailController.text));
    }
  }
}
