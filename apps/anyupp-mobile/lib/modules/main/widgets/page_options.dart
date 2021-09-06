import 'package:flutter/material.dart';

class MainPageOptions {
  final bool showAppBar;
  final String appBarText;
  final Color systemBarColor;

  MainPageOptions({
    required this.showAppBar,
    required this.appBarText,
    required this.systemBarColor,
  });

  @override
  String toString() {
    return 'MainPageData(showAppBar: $showAppBar, appBarText: $appBarText, systemBarColor: $systemBarColor)';
  }
}
