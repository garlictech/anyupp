import 'dart:async';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key key}) : super(key: key);

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  AnimationController _controller;
  Animation<double> _backgroundImageScaleAnimation;

  AnimationController _buttonAnimController;
  Animation<double> _buttonsOpacityAnim;
  Animation<Offset> _buttonsPositionAnim;

  GlobalKey _bottomKey = GlobalKey();
  double _bottomWidgetHeight;
  final double _backgroundAnimationSize = 50.0;
  bool _showLogin = false;
  double _emailFormHeight = EMAIL_FORM_HEIGHT;
  // String _userAgent = '<unknown>';

  static const double EMAIL_FORM_HEIGHT = 235.0;
  static const int EMAIL_ANIMATION_DURATION = 350;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _buttonAnimController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    // _backgroundImageScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);
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

  // Future<void> setUserAgent() async {
  //   _userAgent = await FlutterUserAgent.getPropertyAsync('userAgent');
  // }

  @override
  void dispose() {
    _buttonAnimController?.dispose();
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (BuildContext context, LoginState state) {
        if (state is EmailFormUIChange) {
          // print('LoginScreen.listener.state=${state.ui}');
          double height = 0.0;
          switch (state.ui) {
            case LoginFormUI.SHOW_PASSWORD_CONFIRM:
              height = 290.0;
              break;
            case LoginFormUI.SHOW_LOGIN_WITH_PASSWORD:
              height = 235.0;
              break;
            case LoginFormUI.SHOW_REGISTRATION:
              height = 290.0;
              break;
            case LoginFormUI.SHOW_FORGOT_PASSWORD:
              height = 180.0;
              break;
            case LoginFormUI.SHOW_CONFIRM_SIGNUP:
              height = 235.0;
              break;
          }
          setState(() {
            print('LoginScreen._emailFormHeight=$height');
            _emailFormHeight = height;
          });
        }
      },
      child: BlocBuilder<LoginBloc, LoginState>(
        builder: (BuildContext context, LoginState state) {
          if (state is NeedAccountLinking) {
            // Need schedulerBinding to handle dialog popup
            SchedulerBinding.instance.addPostFrameCallback((_) {
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

          // --- Bottom sheet
          return AnimatedBuilder(
            builder: _buildAnimation,
            animation: _controller,
          );
        },
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return SafeArea(
      child: Scaffold(
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
      ),
    );
  }

  void _switchAnimation() {
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

  Widget _buildAnimation(BuildContext context, Widget child) {
    final height = MediaQuery.of(context).size.height;
    final statusBarHeight = MediaQuery.of(context).padding.top;
    final iOS = Theme.of(context).platform == TargetPlatform.iOS;
    //print('**** isIOS=$iOS');

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
                Container(height: height - statusBarHeight),
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
                //       style: GoogleFonts.poppins(
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
                              ((_bottomWidgetHeight +
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
        // print('Size changed=$size');
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
                style: GoogleFonts.poppins(
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
                        style: GoogleFonts.poppins(
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
                          // TODO
                          padding: _showLogin
                              ? const EdgeInsets.all(0.0)
                              : const EdgeInsets.only(top: 28.0),
                          child: Text(
                            trans('login.continueWith'),
                            style: GoogleFonts.poppins(
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
                                style: TextButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  padding: EdgeInsets.all(8.0),
                                ),
                                //: Colors.blueAccent,
                                onPressed:
                                    () => getIt<LoginBloc>().add(LoginWithMethod(LoginMethod.ANONYMOUS)),
                                child: Text(trans('login.signInAnonymously'),
                                    style: GoogleFonts.poppins(
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
                                  style: GoogleFonts.poppins(
                                    fontSize: 14.0,
                                    color: Color(0x993C2F2F),
                                  ),
                                ),
                                TextSpan(
                                  text: trans('tos.aszf'),
                                  style: GoogleFonts.poppins(
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
                        )
                      ],
                    ))),
            if (iOS == true)
              Container(
                color: Colors.white,
                height: 8.0,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialLoginButtons(BuildContext context) {
    return FutureBuilder<bool>(
      future: getIt<LoginRepository>().appleSignInAvailable,
      builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
        if (snapshot.hasData) {
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
                  _createSocialButtonWidget(
                      'email', LoginMethod.EMAIL, theme.indicator),
                  // _createSocialButtonWidget('phone', LoginMethod.PHONE),
                ],
              ),
            ),
          );
        }
        return CenterLoadingWidget();
      },
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
      [Color iconColor]) {
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
              //LoginWithEmailDialog.show(context, linkAccount: false);
              _toggleEmailLoginForm();
              //    getIt<LoginBloc>().add(LoginWithEmailAndPassword(null, null)); // TODO AWS WEB UI

            } else {
              getIt<LoginBloc>().add(LoginWithMethod(method));
              // Nav.to(SocialLoginScreen(
              //   title: 'Facebook',
              //   provider: 'Facebook',
              // ));
            }
          }),
    );
  }

  Widget _buildSocialLoginWebView(LoginMethod method) {
    Completer<WebViewController> _webViewController =
        Completer<WebViewController>();
    String provider;
    switch (method) {
      case LoginMethod.FACEBOOK:
        provider = 'Facebook';
        break;
      case LoginMethod.GOOGLE:
        provider = 'Google';
        break;
      case LoginMethod.APPLE:
        provider = 'SignInWithApple';
        break;
      default:
        provider = 'Cognito';
    }
    var url = "${AppConfig.UserPoolDomain}/oauth2/authorize?identity_provider=$provider&redirect_uri=" +
        "anyupp://signin/&response_type=CODE&client_id=${AppConfig.UserPoolClientId}" +
        "&scope=openid%20phone%20email%20aws.cognito.signin.user.admin%20profile";

    print('loginScreen.url=$url');
    return Scaffold(
      appBar: AppBar(
        leading: Container(
          padding: EdgeInsets.only(
            left: 8.0,
            top: 4.0,
            bottom: 4.0,
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1,
                color: theme.border2,
              ),
            ),
            child: BackButton(
              onPressed: () => getIt<LoginBloc>().add(ResetLogin()),
              color: theme.text,
            ),
          ),
        ),
        elevation: 0.0,
        iconTheme: IconThemeData(
          color: theme.text, //change your color here
        ),
        backgroundColor: theme.background,
        title: Text(
          trans("login.email.signIn"),
          style: GoogleFonts.poppins(
            color: Colors.black,
          ),
          //getLocalizedText(context, widget.item.name),
        ),
      ),
      body: WebView(
        key: UniqueKey(),
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Mobile Safari/537.36',
        initialUrl: url,
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webViewController) async{
          _webViewController.complete(webViewController);
        },
        navigationDelegate: (NavigationRequest request) {
          print('SocialLoginScreen.navigationDelegate().request=$request');
          if (request.url
              .startsWith('${SocialLoginScreen.SIGNIN_CALLBACK}?code=')) {
            var code = request.url
                .substring('${SocialLoginScreen.SIGNIN_CALLBACK}?code='.length);
            //For some reasion there is an extra # and some other stuff at the end of the url in case of first login.
            //Remove it so it will be a valid url
            code = code.split("#").first;
            // This is the authorization code!!!
            signUserInWithAuthCode(code);
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
        gestureNavigationEnabled: true,
      ),
    );
  }

  // ignore: unused_element
  void _toggleEmailLoginForm() {
    setState(() {
      _showLogin = !_showLogin;
    });
  }

  void signUserInWithAuthCode(String code) {
    print('loginScreen.signUserInWithAuthCode().code=$code');
    getIt<LoginBloc>().add(CompleteLoginWithMethod(null, code));
    // getIt<LoginRepository>().signUserInWithAuthCode(code);
  }
}
