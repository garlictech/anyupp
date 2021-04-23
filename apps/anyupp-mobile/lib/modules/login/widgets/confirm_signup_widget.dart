import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class ConfirmSignUpWidget extends StatefulWidget {
  @override
  _ConfirmSignUpWidgetState createState() => _ConfirmSignUpWidgetState();
}

class _ConfirmSignUpWidgetState extends State<ConfirmSignUpWidget> {
  final _confirmCodeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String userName;

  @override
  void dispose() {
    _confirmCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (context, state) {
        if (state is ConfirmCodeEmailSent) {
          showSuccessDialog(
              context,
              trans('login.email.setMailTo'),
              trans(
                'login.email.checkInbox',
              ));

          return _buildSignUpConfirmForm(context, state.user);
        }

        // TODO: implement listener
      },
      child: BlocBuilder<LoginBloc, LoginState>(
        builder: (BuildContext context, LoginState state) {
          if (state is CodeConfirmedState) {
            return _buildEmailConfirmedInfo(context);
          }
          if (state is ConfirmCodeState) {
            return _buildSignUpConfirmForm(context, state.user);
          }
          if (state is LoginInProgress) {
            _buildLoading(
              context,
            );
          }

          return _buildLoading(
            context,
          );
        },
      ),
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

  Widget _buildSignUpConfirmForm(BuildContext context, String user) {
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
                    Container(
                      padding: EdgeInsets.all(8.0),
                      child: RichText(
                        textAlign: TextAlign.center,
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: trans('login.email.setMailTo') + ' ',
                              style: GoogleFonts.poppins(
                                fontSize: 14.0,
                                color: Color(0x993C2F2F),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Email + passwords input fields
                    LoginFormUtils.buildTextField(
                        context,
                        trans('login.email.verificationCode'),
                        _confirmCodeController,
                        TextInputType.emailAddress,
                        false,
                        LoginFormUtils.confirmCodeValidator(context)),

                    Container(
                      padding: EdgeInsets.all(8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: trans('login.email.codeNotReceived') +
                                      ' ',
                                  style: GoogleFonts.poppins(
                                    fontSize: 14.0,
                                    color: Color(0x993C2F2F),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          InkWell(
                            onTap: () async {
                              FocusScope.of(context).unfocus();
                              getIt<LoginBloc>().add(CodeReSendining());
                              await Future.delayed(Duration(seconds: 1));
                              getIt<LoginBloc>()
                                  .add(SentConfirmCodeEmail(user));
                               getIt<LoginBloc>().add(SignUpConfirm(user));
                            },
                            child: Text(
                              trans('login.email.resendCode'),
                              textAlign: TextAlign.start,
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                color: theme.highlight,
                                fontWeight: FontWeight.normal,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ],
                      ),
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
                          trans('login.email.confirmAccount'),
                          style: GoogleFonts.poppins(
                            color: theme.text2,
                            fontSize: 20.0,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        onPressed: () => _confirmSigInCode(user),
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

  Widget _buildEmailConfirmedInfo(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: EdgeInsets.all(12.0),
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: Text(
                  trans('login.email.dialogConfirmedTitle'),
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
                    child: Column(
                      children: [
                        Text(
                          trans('login.email.dialogConfirmedMessage'),
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 18.0,
                          ),
                        ),
                        SizedBox(
                          height: 8.0,
                        ),
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
                      ],
                    )),
              ),
              // Buttons
            ],
          ),
        ),
      ],
    );
  }

  void _confirmSigInCode(String user) {
    getIt<LoginBloc>().add(SignUpConfirmed());
    // print('_confirmSigInCode()=${_confirmCodeController.text}');
    // if (_formKey.currentState.validate()) {
    //   _formKey.currentState.save();
    //   getIt<LoginBloc>()
    //       .add(SendPasswordResetEmail(_confirmCodeController.text));
    // }
  }
}
