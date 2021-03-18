import 'package:flutter/material.dart';

import 'package:fa_prev/core/theme/theme.dart';


class ThemeWidget extends InheritedWidget {

  final ThemeChainData theme; 

  ThemeWidget({ Key key, @required this.theme, @required Widget child,}) : assert(theme != null),
       assert(child != null),
       super(key: key, child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) { return false;}

 static ThemeWidget of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeWidget>();
  }
}
