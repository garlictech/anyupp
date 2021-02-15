import 'package:badges/badges.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:google_fonts/google_fonts.dart';

class BottomBarItem extends StatelessWidget {
  final String text;
  final IconData icon;
  final bool selected;
  final String badge;
  final VoidCallback onTapped;

  const BottomBarItem(
      {Key key, @required this.text, @required this.icon, this.selected = false, this.badge, this.onTapped})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return badge != null
        ? Badge(
            elevation: 3.0,
            //padding: EdgeInsets.only(left: 10.0),
            position: BadgePosition.topEnd(top: 0.0, end: 0.0),
            animationType: BadgeAnimationType.fade,
            animationDuration: const Duration(milliseconds: 500),
            badgeContent: Padding(
              padding: const EdgeInsets.all(0.0),
              child: Text(
                ' $badge ',
                style: GoogleFonts.poppins(
                  fontSize: 14.0,
                  color: theme.text2,
                ),
              ),
            ),
            badgeColor: theme.highlight,
            child: _buildIconAndText(),
          )
        : _buildIconAndText();
  }

  Widget _buildIconAndText() {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Stack(
        children: [
          Wrap(
            direction: Axis.vertical,
            alignment: WrapAlignment.spaceAround,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              selected
                  ? Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: theme.indicator.withOpacity(0.2),
                      ),
                      child: IconButton(
                        icon: Icon(icon),
                        color: theme.indicator,
                        onPressed: onTapped,
                      ),
                    )
                  : IconButton(
                      icon: Icon(icon),
                      color: selected ? theme.indicator : theme.disabled.withOpacity(0.4), //theme.indicator,
                      onPressed: onTapped,
                    ),
              Text(
                text,
                style: GoogleFonts.poppins(
                  color: selected ? theme.indicator : theme.disabled.withOpacity(0.4),
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
