import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class BackButtonWidget extends StatelessWidget {
  final Color? color;
  final double iconSize;
  final bool showBorder;
  final IconData icon;
  final VoidCallback? onPressed;

  const BackButtonWidget({
    Key? key,
    this.color,
    this.onPressed,
    this.iconSize = 22.0,
    this.showBorder = true,
    this.icon = Icons.close,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return showBorder
        ? BorderedWidget(
            width: 40,
            height: 40,
            child: Container(
              margin: EdgeInsets.only(bottom: 2),
              child: IconButton(
                iconSize: iconSize,
                icon: Icon(
                  icon,
                  color: color,
                ),
                onPressed: onPressed ?? () => Navigator.maybePop(context),
              ),
            ))
        : Container(
            width: 40,
            child: IconButton(
              iconSize: iconSize,
              icon: Icon(
                icon,
                color: color,
              ),
              onPressed: onPressed ?? () => Navigator.maybePop(context),
            ),
          );
  }
}
