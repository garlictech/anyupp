import 'package:flutter/material.dart';

class ColoredTabBar extends Container implements PreferredSizeWidget {
  final Color color;

  final TabBar tabBar;
  final double? width;

  ColoredTabBar({
    required this.color,
    required this.tabBar,
    this.width,
  });

  @override
  Size get preferredSize => tabBar.preferredSize;

  @override
  Widget build(BuildContext context) => Container(
        // height: 50,
        padding: EdgeInsets.only(
          // left: 16.0,
          right: 8.0,
        ),
        width: width,
        // color: color,
        child: tabBar,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(56.0),
            bottomLeft: Radius.circular(56.0),
          ),
          color: color,
        ),
      );
}
