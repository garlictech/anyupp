import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen();

  @override
  _LoginScreenState createState() => _LoginScreenState();

  static const SIGNIN_CALLBACK = 'anyupp://signin/';
  static const SIGNOUT_CALLBACK = 'anyupp://signout/';
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _backgroundImageScaleAnimation;

  late AnimationController _buttonAnimController;
  late Animation<double> _buttonsOpacityAnim;
  late Animation<Offset> _buttonsPositionAnim;

  GlobalKey _bottomKey = GlobalKey();
  double? _bottomWidgetHeight;
  final double _backgroundAnimationSize = 50.0;
  bool _showLogin = false;
  double _emailFormHeight = EMAIL_FORM_HEIGHT;
  bool isLoading = true;
  UniqueKey builderKey = UniqueKey();

  static const double EMAIL_FORM_HEIGHT = 235.0;
  static const int EMAIL_ANIMATION_DURATION = 350;

  @override
  void initState() {
    super.initState();
    log.d('LOGINSCREEN.initState()');

    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _buttonAnimController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _backgroundImageScaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    _buttonsOpacityAnim =
        CurveTween(curve: Curves.easeOut).animate(_buttonAnimController);
    _buttonsPositionAnim = Tween(begin: Offset(-1.0, 0.0), end: Offset.zero)
        .chain(CurveTween(curve: Curves.elasticOut))
        .animate(_buttonAnimController);

    Future.delayed(Duration(milliseconds: 1000))
        .then((value) => _switchAnimation());
  }

  @override
  void dispose() {
    _buttonAnimController.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<ExceptionBloc, ExceptionState>(
            listener: (BuildContext context, ExceptionState state) {
          if (state is ExceptionShowState) {
            log.d('LoginScreen.ExceptionState=$state');
            builderKey = UniqueKey();
            setState(() {});
            // Future.delayed(Duration(seconds: 1)).then((_) =>
            //     getIt<ExceptionBloc>().add(ShowException(state.exception)));
            // _showException(context, state.exception);
          }
        }),
        BlocListener<LoginBloc, LoginState>(
            listener: (BuildContext context, LoginState state) {
          if (state is EmailFormUIChange) {
            // log.d('LoginScreen.listener.state=${state.ui}');
            double height = 0.0;
            switch (state.ui) {
              case LoginFormUI.SHOW_PASSWORD_CONFIRM:
                height += 290.0;
                break;
              case LoginFormUI.SHOW_LOGIN_WITH_PASSWORD:
                height += 235.0;
                break;
              case LoginFormUI.SHOW_REGISTRATION:
                height += 290.0;
                break;
              case LoginFormUI.SHOW_FORGOT_PASSWORD:
                height += 180.0;
                break;
              case LoginFormUI.SHOW_CONFIRM_SIGNUP:
                height += 235.0;
                break;
            }
            setState(() {
              log.d('LoginScreen._emailFormHeight=$height');
              _emailFormHeight = height;
            });
          }
        }),
      ],
      child: BlocBuilder<LoginBloc, LoginState>(
        builder: (BuildContext context, LoginState state) {
          if (state is NeedAccountLinking) {
            // Need schedulerBinding to handle dialog popup
            SchedulerBinding.instance?.addPostFrameCallback((_) {
              showSelectAccountToLinkDialog(context, state);
            });
            return _buildLoadingScreen();
          }

          if (state is LoginInProgress || state is LoginSuccess) {
            return _buildLoadingScreen();
          }

          if (state is ShowSocialLoginWebView) {
            return _buildSocialLoginWebView(state.provider);
          }
          if (state is LoginError) {
            builderKey = UniqueKey();
          }

          // --- Bottom sheet
          return AnimatedBuilder(
            key: builderKey,
            builder: _buildAnimation,
            animation: _controller,
          );
        },
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      key: builderKey,
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // BACKGROUND IMAGE
          Positioned(
            top: -_backgroundImageScaleAnimation.value *
                _backgroundAnimationSize,
            left: -_backgroundImageScaleAnimation.value *
                _backgroundAnimationSize,
            bottom: -_backgroundImageScaleAnimation.value *
                _backgroundAnimationSize,
            right: -_backgroundImageScaleAnimation.value *
                _backgroundAnimationSize,
            child: _buildBackground(context),
          ),
          CenterLoadingWidget(),
        ],
      ),
    );
  }

  void _switchAnimation() {
    FocusManager.instance.primaryFocus?.unfocus();
    if (!mounted) {
      return;
    }

    if (_controller.status == AnimationStatus.dismissed) {
      _controller.forward();
      _buttonAnimController.forward();
    }
    if (_controller.status == AnimationStatus.completed) {
      setState(() {
        _showLogin = false;
      });
      _controller.reverse();
      _buttonAnimController.reverse();
    }
  }

  Widget _buildAnimation(BuildContext context, Widget? child) {
    final height = MediaQuery.of(context).size.height;
    final statusBarHeight = MediaQuery.of(context).padding.top;
    // final bottomBarHeight = MediaQuery.of(context).padding.bottom;
    final iOS = Theme.of(context).platform == TargetPlatform.iOS;
    //log.d('**** isIOS=$iOS');

    return SafeArea(
      bottom: !iOS,
      top: !iOS,
      child: Scaffold(
        backgroundColor: Colors.white,
        body: GestureDetector(
          behavior: HitTestBehavior.deferToChild,
          onTap: () => _switchAnimation(),
          onVerticalDragUpdate: (details) {
            if (_controller.status == AnimationStatus.dismissed &&
                details.delta.dy < -20.0) {
              _switchAnimation();
            } else if (_controller.status == AnimationStatus.completed &&
                details.delta.dy > 20.0) {
              _switchAnimation();
            }
          },
          child: SingleChildScrollView(
            child: Stack(
              children: [
                Container(height: iOS ? height : height - statusBarHeight),
                // BACKGROUND IMAGE
                Positioned(
                  top: -_backgroundImageScaleAnimation.value *
                      _backgroundAnimationSize,
                  left: -_backgroundImageScaleAnimation.value *
                      _backgroundAnimationSize,
                  bottom: -_backgroundImageScaleAnimation.value *
                      _backgroundAnimationSize,
                  right: -_backgroundImageScaleAnimation.value *
                      _backgroundAnimationSize,
                  child: _buildBackground(context),
                ),

                //Info text
                // Positioned(
                //   top: 16.0,
                //   left: 16.0,
                //   child: Text(
                //       '${_backgroundImageScaleAnimation.value.toStringAsFixed(2)}, H:$height h:$_bottomWidgetHeight',
                //       //h0: $_bottomWidgetHeight h1:${_bottomKey?.currentContext?.findRenderObject()?.paintBounds?.height}',
                //       style: Fonts.satoshi(
                //         color: Colors.white,
                //       )),
                // ),

                // Center logo
                Positioned(
                  top: (height / 2.0 - 50) -
                      ((height / 2.0 - 50 - 36.0) *
                          _backgroundImageScaleAnimation.value),
                  left: 0.0,
                  right: 0.0,
                  child: _buildLogo(context),
                ),

                // Bottom sheet
                Positioned(
                  top: _controller.status == AnimationStatus.completed
                      ? null
                      : _bottomWidgetHeight == null
                          ? height
                          : height -
                              ((_bottomWidgetHeight! +
                                          (iOS == true ? 0.0 : 20.0)) *
                                      _backgroundImageScaleAnimation.value) *
                                  1.0,
                  left: 0.0,
                  right: 0.0,
                  bottom: _controller.status == AnimationStatus.completed
                      ? 0.0
                      : null,
                  child: _buildBottomSheetContent(context, iOS),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBackground(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/anyapp_background.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        // Set gradient black in image splash screen
        decoration: BoxDecoration(
          color: Color.fromRGBO(0, 0, 0, 0.65),
        ),
      ),
    );
  }

  Widget _buildLogo(BuildContext context) {
    return AnimatedOpacity(
      opacity: _showLogin ? 0.0 : 1.0,
      duration: Duration(milliseconds: EMAIL_ANIMATION_DURATION * 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(
            'assets/icons/any_app_logo.svg',
            width: 40.0,
            height: 50.0,
            fit: BoxFit.fill,
          ),
          SizedBox(
            width: 8.0,
          ),
          Text.rich(
            TextSpan(
              style: GoogleFonts.hammersmithOne(
                fontSize: 30,
                color: const Color(0xffffffff),
              ),
              children: [
                TextSpan(
                  text: 'Any',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                TextSpan(
                  text: 'Upp',
                  style: TextStyle(
                    color: const Color(0xff30bf60),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            textAlign: TextAlign.left,
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSheetContent(BuildContext context, bool iOS) {
    return MeasuredWidget(
      onChange: (Size size) {
        // log.d('Size changed=$size');
        setState(() {
          _bottomWidgetHeight = size.height;
        });
      },
      child: Container(
        key: _bottomKey,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                left: 12.0,
              ),
              child: Text(
                trans('login.welcome'),
                style: Fonts.satoshi(
                  fontSize: 36.0,
                  color: Color(0xFFFFFFFF),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            AnimatedContainer(
              height: !_showLogin ? 40 : 0,
              duration: Duration(milliseconds: EMAIL_ANIMATION_DURATION * 2),
              curve: Curves.fastOutSlowIn,
              child: Container(
                  height: 40,
                  padding: const EdgeInsets.only(
                    left: 12.0,
                  ),
                  child: Row(children: [
                    TextButton(
                      child: Text(
                        trans('login.join'),
                        style: Fonts.satoshi(
                          fontSize: 16.0,
                          color: const Color(0xffffffff),
                        ),
                      ),
                      style: TextButton.styleFrom(
                        backgroundColor: Color(0xFF30BF60),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(40),
                        ),
                      ),
                      onPressed: () {},
                    ),
                  ])),
            ),
            // Bottom white background componenet
            GestureDetector(
                onTap: () => {},
                child: Container(
                    margin: EdgeInsets.only(top: 24.0),
                    //height: MediaQuery.of(context).size.height,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20.0),
                        topRight: Radius.circular(20.0),
                      ),
                      color: Colors.white,
                    ),
                    child: Column(
                      children: [
                        Container(
                            padding: EdgeInsets.only(
                              top: 8.0,
                            ),
                            child: Align(
                                alignment: Alignment.topCenter,
                                child: SizedBox(
                                    width: 60.0,
                                    height: 8.0,
                                    child: Container(
                                        decoration: BoxDecoration(
                                      borderRadius: BorderRadius.all(
                                        Radius.circular(3.0),
                                      ),
                                      color: Color(0xFFD0D0D0),
                                    ))))),
                        _buildEmailLoginForms(context),
                        Padding(
                          padding: _showLogin
                              ? const EdgeInsets.all(0.0)
                              : const EdgeInsets.only(top: 28.0),
                          child: Text(
                            trans('login.continueWith'),
                            style: Fonts.satoshi(
                              fontSize: 14.0,
                              fontWeight: FontWeight.w600,
                              color: Color(0x993C2F2F),
                            ),
                          ),
                        ),
                        FadeTransition(
                          opacity: _buttonsOpacityAnim,
                          child: SlideTransition(
                            position: _buttonsPositionAnim,
                            child: _buildSocialLoginButtons(context),
                          ),
                        ),
                        Container(
                            //height: 57.0,
                            padding: EdgeInsets.all(8.0),
                            width: double.infinity,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.all(Radius.zero),
                              border: Border.all(
                                width: 1.5,
                                color: const Color(0xffe7e5d0),
                              ),
                            ),
                            child: TextButton(
                                key: const Key('login-btn-anonymous'),
                                style: TextButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  padding: EdgeInsets.all(8.0),
                                ),
                                //: Colors.blueAccent,
                                onPressed: () => getIt<LoginBloc>().add(
                                    LoginWithMethod(LoginMethod.ANONYMOUS)),
                                child: Text(trans('login.signInAnonymously'),
                                    style: Fonts.satoshi(
                                      fontSize: 14.0,
                                      color: Color(0x993C2F2F),
                                    )))),
                        Container(
                          padding: EdgeInsets.all(8.0),
                          child: RichText(
                            textAlign: TextAlign.center,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: trans('tos.acceptionPrefix') + ' ',
                                  style: Fonts.satoshi(
                                    fontSize: 14.0,
                                    color: Color(0x993C2F2F),
                                  ),
                                ),
                                TextSpan(
                                  text: trans('tos.aszf'),
                                  style: Fonts.satoshi(
                                    fontSize: 14.0,
                                    decoration: TextDecoration.underline,
                                    color: Color(0x993C2F2F),
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () {
                                      launch('https://www.anyupp.com/privacy/');
                                    },
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: iOS ? 8 : 0,
                        )
                      ],
                    ))),
            // if (iOS == true)
            //   Container(
            //     color: Colors.white,
            //     height: 8.0,
            //   ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialLoginButtons(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(
        top: 6.0,
        bottom: 6.0,
      ),
      child: Center(
        child: Wrap(
          direction: Axis.horizontal,
          children: [
            _createSocialButtonWidget('google', LoginMethod.GOOGLE),
            _createSocialButtonWidget('facebook', LoginMethod.FACEBOOK),
            // if (snapshot.data == true) // has Apple Login
            _createSocialButtonWidget('apple', LoginMethod.APPLE),
            _createSocialButtonWidget('email', LoginMethod.EMAIL,
                iconColor: Color(0xFF30BF60)),
            // _createSocialButtonWidget('phone', LoginMethod.PHONE),
          ],
        ),
      ),
    );
  }

  Widget _buildEmailLoginForms(BuildContext context) {
    return AnimatedContainer(
      height: _showLogin ? _emailFormHeight : 0,
      duration: Duration(milliseconds: EMAIL_ANIMATION_DURATION),
      curve: Curves.fastOutSlowIn,
      child: EmailLoginPageViewWidget(),
    );
  }

  Widget _createSocialButtonWidget(String icon, LoginMethod method,
      {Color? iconColor}) {
    final bool iOS = Theme.of(context).platform == TargetPlatform.iOS;
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: SocialLoginButtonWidget(
          providerIcon: icon,
          method: method,
          iconColor: iconColor,
          size: iOS ? 66.0 : 70.0,
          onTap: () {
            if (method == LoginMethod.EMAIL) {
              // This dialog handle all the Login BloC calls by itself
              _toggleEmailLoginForm();
            } else {
              // getIt<LoginBloc>().add(LoginWithMethod(method));
              launchURL(LoginMethodUtils.methodToString(method));
            }
          }),
    );
  }

  Widget _buildSocialLoginWebView(LoginMethod method) {
    return CenterLoadingWidget();
  }

  // ignore: unused_element
  void _toggleEmailLoginForm() {
    setState(() {
      _showLogin = !_showLogin;
    });
  }

  void signUserInWithAuthCode(String code) {
    log.d('loginScreen.signUserInWithAuthCode().code=$code');
    getIt<LoginBloc>().add(CompleteLoginWithMethod(code));
  }
}
