import 'package:flutter/material.dart';

class ColoredTabBar extends Container implements PreferredSizeWidget {
  final Color color;

  final TabBar tabBar;

  ColoredTabBar({required this.color, required this.tabBar});

  @override
  Size get preferredSize => tabBar.preferredSize;

  @override
  Widget build(BuildContext context) => Container(
        color: color,
        child: tabBar,
      );
}
