import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/login/login.dart';

class EmailLoginDialogContentWidget extends StatefulWidget {
  @override
  _EmailLoginDialogContentWidgetState createState() =>
      _EmailLoginDialogContentWidgetState();
}

class _EmailLoginDialogContentWidgetState
    extends State<EmailLoginDialogContentWidget> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
        print('EmailDialogContentWidget.auth.bloc.state=$state');
        if (state is LoginError || state is LoginSuccess) {
          // Navigator.of(context).pop();
        }
      },
      child: BlocBuilder<LoginBloc, LoginState>(
          builder: (BuildContext context, LoginState state) {
        // print('EmailLoginDialogContentWidget.bloc.state=$state');

        if (state is LoginInProgress) {
          return _buildLoading(context,
              message: trans('login.email.loginProgress'));
        }

        if (state is EmailLinkSent) {
          return _buildEmailSentInfo(context);
        }

        return _buildEmailForm(context);
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

  Widget _buildEmailForm(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Stack(
            children: [
              Container(
                padding: EdgeInsets.only(top: 8.0, left: 12.0, right: 12.0),
                child: Column(
                  children: [
                    // Stack(
                    //   children: [
                    //     Align(
                    //       alignment: Alignment.centerLeft,
                    //       child: InkWell(
                    //         onTap: () {
                    //           getIt<LoginBloc>().add(ChangeEmailFormUI(
                    //             ui: LoginFormUI.SHOW_FORGOT_PASSWORD,
                    //             animationCurve: Curves.easeOut,
                    //           ));
                    //         },
                    //         child: Text(
                    //           trans('login.email.forgotPassword'),
                    //           textAlign: TextAlign.start,
                    //           style: GoogleFonts.poppins(
                    //             fontSize: 14,
                    //             color: theme.highlight,
                    //             fontWeight: FontWeight.normal,
                    //             decoration: TextDecoration.underline,
                    //           ),
                    //         ),
                    //       ),
                    //     ),
                    //   ],
                    // ),
                    // Email input field
                    LoginFormUtils.buildTextField(
                      context,
                      trans('login.email.emailOrPhoneFieldLabel'),
                      _emailController,
                      TextInputType.emailAddress,
                      false,
                      LoginFormUtils.emailOrPhoneValidator(context),
                    ),
                    AnimatedContainer(
                        height: LoginFormUtils.TEXTFIELD_HEIGHT,
                        duration: Duration(milliseconds: 350),
                        curve: Curves.fastOutSlowIn,
                        child: LoginFormUtils.buildTextField(
                          context,
                          trans('login.email.passwordFieldLabel'),
                          _passwordController,
                          TextInputType.text,
                          true,
                          LoginFormUtils.passwordValidator(context),
                        )),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        InkWell(
                          onTap: () {
                            getIt<LoginBloc>().add(ChangeEmailFormUI(
                              ui: LoginFormUI.SHOW_FORGOT_PASSWORD,
                              animationCurve: Curves.easeOut,
                            ));
                          },
                          child: Text(
                            trans('login.email.forgotPassword'),
                            textAlign: TextAlign.start,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: theme.highlight,
                              fontWeight: FontWeight.normal,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            getIt<LoginBloc>().add(ChangeEmailFormUI(
                              ui: LoginFormUI.SHOW_REGISTRATION,
                              animationCurve: Curves.easeOut,
                            ));
                          },
                          child: Text(
                            trans('login.email.linkRegister'),
                            textAlign: TextAlign.start,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: theme.highlight,
                              fontWeight: FontWeight.normal,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        )
                      ],
                    ),
                    // Stack(
                    //   children: [
                    //     Align(
                    //       alignment: Alignment.centerRight,
                    //       child: InkWell(
                    //         onTap: () {
                    //           getIt<LoginBloc>().add(ChangeEmailFormUI(
                    //             ui: LoginFormUI.SHOW_REGISTRATION,
                    //             animationCurve: Curves.easeOut,
                    //           ));
                    //         },
                    //         child: Text(
                    //           trans('login.email.linkRegister'),
                    //           textAlign: TextAlign.start,
                    //           style: GoogleFonts.poppins(
                    //             fontSize: 14,
                    //             color: theme.highlight,
                    //             fontWeight: FontWeight.normal,
                    //             decoration: TextDecoration.underline,
                    //           ),
                    //         ),
                    //       ),
                    //     ),
                    //   ],
                    // ),
                    SizedBox(
                      height: 8.0,
                    ),

                    // Button
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
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 350),
                          transitionBuilder:
                              (Widget child, Animation<double> animation) {
                            return ScaleTransition(
                              child: child,
                              scale: animation,
                            );
                          },
                          child: Text(
                            trans('login.email.buttonLogin'),
                            key: ValueKey<String>('EMAIL_LOGIN_BUTTON'),
                            softWrap: false,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              color: theme.text2,
                              fontSize: 20.0,
                              fontWeight: FontWeight.normal,
                            ),
                          ),
                        ),
                        onPressed: () => _loginWithEmailAndPassword(),
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
                  trans('login.email.dialogEmailSentTitle'),
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
                      trans('login.email.dialogEmailSentMessage'),
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 18.0,
                      ),
                    )),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _loginWithEmailAndPassword() {
    print('_loginWithEmailAndPassword()=${_emailController.text}');
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      getIt<LoginBloc>().add(LoginWithEmailAndPassword(
          _emailController.text, _passwordController.text));
    }
  }
}
