import 'package:badges/badges.dart';
import 'package:flutter/material.dart';
import '/core/theme/theme.dart';

class BottomBarItem extends StatelessWidget {
  final String text;
  final IconData icon;
  final bool selected;
  final String? badge;
  final VoidCallback? onTapped;
  final Color? badgeColor;
  final Color? selectedColor;
  final Color? unselectedColor;

  const BottomBarItem({
    required this.text,
    required this.icon,
    this.selected = false,
    this.badge,
    this.onTapped,
    this.badgeColor,
    this.selectedColor,
    this.unselectedColor,
  });

  @override
  Widget build(BuildContext context) {
    return badge != null
        ? Badge(
            elevation: 0.0,
            padding: EdgeInsets.all(0),
            position: BadgePosition.topEnd(top: 12.0, end: 24.0),
            animationType: BadgeAnimationType.fade,
            animationDuration: const Duration(milliseconds: 500),
            badgeContent: Padding(
              padding: const EdgeInsets.all(4),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFFE74C3C),
                ),
                width: 12.0,
                height: 12.0,
              ),
            ),
            badgeColor: badgeColor ?? theme.secondary0, // theme.primary,
            child: _buildIconAndText(),
          )
        : _buildIconAndText();
  }

  Widget _buildIconAndText() {
    return InkWell(
      onTap: onTapped,
      child: Container(
        height: 66.0,
        // padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        padding: const EdgeInsets.only(
          bottom: 8.0,
          left: 16.0,
          right: 16.0,
        ),
        decoration: selected
            ? BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: selectedColor ?? theme.icon,
                    width: 2.0,
                  ),
                ),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 0.0),
              child: Icon(
                icon,
                color: selected
                    ? (selectedColor ?? theme.icon)
                    : (unselectedColor ?? theme.secondary64),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 6.0),
              child: Text(
                text,
                style: selected
                    ? Fonts.pP2Bold(
                        color: selectedColor ?? theme.icon,
                      )
                    : Fonts.pP2(
                        color: unselectedColor ?? theme.secondary64,
                      ),
              ),
            ),
            // if (selected)
            //   SizedBox(
            //     height: 3,
            //   ),
          ],
        ),
      ),
    );
  }
}
