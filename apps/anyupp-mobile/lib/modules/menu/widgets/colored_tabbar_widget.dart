import 'package:flutter/material.dart';

class ColoredTabBar extends Container implements PreferredSizeWidget {
  final Color color;

  final TabBar tabBar;

  ColoredTabBar({required this.color, required this.tabBar});

  @override
  Size get preferredSize => tabBar.preferredSize;

  @override
  Widget build(BuildContext context) => Container(
        // height: 50,
        padding: EdgeInsets.only(
          left: 16.0,
          right: 8.0,
        ),
        color: color,
        child: tabBar,
      );
}
