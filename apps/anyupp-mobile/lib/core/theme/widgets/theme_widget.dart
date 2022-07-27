import 'package:flutter/material.dart';

import '/core/theme/theme.dart';

class ThemeWidget extends InheritedWidget {
  final ThemeChainData theme;

  ThemeWidget({
    required Key key,
    required this.theme,
    required Widget child,
  }) : super(key: key, child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) {
    return false;
  }

  static ThemeWidget? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeWidget>();
  }
}
