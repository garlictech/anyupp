import 'package:fa_prev/core/context/app_context.dart';
import 'package:fa_prev/core/logger.dart';
import 'package:flutter/material.dart';

enum NavAnim {
  FADE_IN,
  SLIDEIN_DOWN,
}

class Nav {
  static const Duration _DEFAULT_ANIM_DURATION = Duration(milliseconds: 200);

  static void to(
    Widget page, {
    Duration duration = _DEFAULT_ANIM_DURATION,
    NavAnim animationType = NavAnim.FADE_IN,
  }) {
    AppContext.state?.push(_createRoute(
      page,
      duration,
      animationType,
    ));
  }

  static Future<T?> toWithResult<T>(
    Widget page, {
    Duration duration = _DEFAULT_ANIM_DURATION,
    NavAnim animationType = NavAnim.FADE_IN,
  }) async {
    return AppContext.state?.push<T>(_createRoute<T>(
      page,
      duration,
      animationType,
    ));
  }

  static void replace(
    Widget page, {
    Duration duration = _DEFAULT_ANIM_DURATION,
    NavAnim animationType = NavAnim.FADE_IN,
  }) {
    AppContext.state?.pushReplacement(_createRoute(
      page,
      duration,
      animationType,
    ));
  }

  static void reset(
    Widget page, {
    Duration duration = _DEFAULT_ANIM_DURATION,
    NavAnim animationType = NavAnim.FADE_IN,
  }) {
    AppContext.state?.pushAndRemoveUntil(
      _createRoute(
        page,
        duration,
        animationType,
      ),
      (Route<dynamic> route) => false,
    );
  }

  static void pop<T>([T? result]) {
    if (AppContext.state?.canPop() == true) {
      AppContext.state?.pop(result);
    }
  }

  static void popUntil<T>([T? result]) {
    AppContext.state?.popUntil((route) {
      log.e('route.runtimeType=${route.runtimeType}');
      return route.isFirst;
    });
  }

  static Route<T> _createRoute<T>(
      Widget page, Duration duration, NavAnim animationType) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: duration,
      reverseTransitionDuration: duration,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        switch (animationType) {
          case NavAnim.FADE_IN:
            return _createFadeInAnimation(animation, child);
          case NavAnim.SLIDEIN_DOWN:
            return _createSlideInFromDownAnimation(animation, child);
          default:
            return _createFadeInAnimation(animation, child);
        }
      },
    );
  }

  static Widget _createSlideInFromDownAnimation(
      Animation<double> animation, Widget child) {
    var begin = Offset(0.0, 1.0);
    var end = Offset.zero;
    var curve = Curves.ease;
    var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

    return SlideTransition(
      position: animation.drive(tween),
      child: child,
    );
  }

  static Widget _createFadeInAnimation(
      Animation<double> animation, Widget child) {
    return Opacity(
      opacity: animation.value,
      child: child,
    );
  }
}
