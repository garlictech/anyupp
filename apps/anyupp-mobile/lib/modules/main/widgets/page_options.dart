import 'package:flutter/material.dart';

class MainPageOptions {
  final bool showAppBar;
  final String appBarText;
  final Color systemBarColor;

  MainPageOptions({
    this.showAppBar,
    this.appBarText,
    this.systemBarColor,
  });

  @override
  String toString() {
    return 'MainPageData(showAppBar: $showAppBar, appBarText: $appBarText, systemBarColor: $systemBarColor)';
  }
}
