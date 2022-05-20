import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ConfirmSignUpWidget extends StatefulWidget {
  @override
  _ConfirmSignUpWidgetState createState() => _ConfirmSignUpWidgetState();
}

class _ConfirmSignUpWidgetState extends State<ConfirmSignUpWidget> {
  final _confirmCodeController = TextEditingController();

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
            context: context,
            title: trans('login.email.setMailTo'),
            message: trans(
              'login.email.checkInbox',
            ),
          );
        }
      },
      child: BlocBuilder<LoginBloc, LoginState>(
        builder: (BuildContext context, LoginState state) {
          if (state is CodeConfirmedState) {
            return _buildEmailConfirmedInfo(context);
          }
          if (state is ConfirmCodeState) {
            return _buildConfirmLinkSent(context, state.user);
          }
          if (state is CodeReSendining) {
            _buildLoading(
              context,
            );
          }
          if (state is ConfirmCodeEmailSent) {
            return _buildConfirmLinkSent(context, state.user);
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

  Widget _buildConfirmLinkSent(BuildContext context, String user) {
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
                  style: Fonts.satoshi(
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
                          trans('login.email.setMailTo'),
                          textAlign: TextAlign.center,
                          style: Fonts.satoshi(
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
                            style: Fonts.satoshi(
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
                            text: trans('login.email.codeNotReceived') + ' ',
                            style: Fonts.satoshi(
                              fontSize: 14.0,
                              color: Color(0x993C2F2F),
                            ),
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      onTap: () async {
                        _resendCode(user);
                      },
                      child: Text(
                        trans('login.email.resendCode'),
                        textAlign: TextAlign.start,
                        style: Fonts.satoshi(
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
              // Buttons
            ],
          ),
        ),
      ],
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
                  style: Fonts.satoshi(
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
                          style: Fonts.satoshi(
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
                            style: Fonts.satoshi(
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

  void _resendCode(String user) {
    log.d('_resendCode');
    getIt<LoginBloc>().add(ResendConfirmationCode(user));
  }
}
