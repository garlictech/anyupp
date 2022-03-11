import 'package:catcher/catcher.dart';
import 'package:flutter/material.dart';

/// Global context handler
/// Do not use Catcher.currentState!!!
/// Instead use:
/// AppContext.context and AppContext.state everywhere
///
/// The reason of this is that the Catcher can't be mocked for tests
class AppContext {
  static GlobalKey<NavigatorState>? _key;
  static BuildContext? get context =>
      _key?.currentContext ?? Catcher.navigatorKey?.currentContext;
  static NavigatorState? get state =>
      _key?.currentState ?? Catcher.navigatorKey?.currentState;

  static void init(GlobalKey<NavigatorState>? key) => _key = key;

  AppContext._internal();
}
