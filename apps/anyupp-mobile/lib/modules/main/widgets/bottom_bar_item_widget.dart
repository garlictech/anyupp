import 'package:badges/badges.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class BottomBarItem extends StatelessWidget {
  final String text;
  final IconData icon;
  final bool selected;
  final String? badge;
  final VoidCallback? onTapped;

  const BottomBarItem({required this.text, required this.icon, this.selected = false, this.badge, this.onTapped});

  @override
  Widget build(BuildContext context) {
    return badge != null
        ? Badge(
            elevation: 3.0,
            //padding: EdgeInsets.only(left: 10.0),
            position: BadgePosition.topEnd(top: 12.0, end: 24.0),
            animationType: BadgeAnimationType.fade,
            animationDuration: const Duration(milliseconds: 500),
            badgeContent: Padding(
              padding: const EdgeInsets.all(0.0),
              child: SizedBox(
                width: 3.0,
                height: 3.0,
              ),
              // child: Text(
              //   ' $badge ',
              //   style: Fonts.satoshi(
              //     fontSize: 14.0,
              //     color: theme.secondary0,
              //   ),
              // ),
            ),
            badgeColor: Color(0xFFE74C3C), // theme.primary,
            child: _buildIconAndText(),
          )
        : _buildIconAndText();
  }

  Widget _buildIconAndText() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      decoration: selected
          ? BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: theme.primary,
                  width: 2.0,
                ),
              ),
            )
          : BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: theme.secondary0,
                  width: 2.0,
                ),
              ),
            ),
      child: Stack(
        children: [
          Wrap(
            direction: Axis.vertical,
            alignment: WrapAlignment.spaceAround,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              selected
                  ? Container(
                      // decoration: BoxDecoration(
                      //   borderRadius: BorderRadius.circular(10),
                      //   color: theme.primary.withOpacity(0.2),
                      // ),
                      child: IconButton(
                        icon: Icon(icon),
                        color: theme.primary,
                        onPressed: onTapped,
                      ),
                    )
                  : IconButton(
                      icon: Icon(icon),
                      color: selected ? theme.primary : theme.secondary64,
                      onPressed: onTapped,
                    ),
              Text(
                text,
                style: Fonts.satoshi(
                  color: selected ? theme.primary : theme.secondary64,
                  fontSize: 12.0,
                  fontWeight: FontWeight.normal,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
