import 'package:flutter/material.dart';
import '/core/theme/theme.dart';

enum BorderedWidgetType {
  CIRCLE,
  ROUNDED,
}

class BorderedWidget extends StatelessWidget {
  final Widget child;
  final BorderedWidgetType type;
  final double? width;
  final double? height;
  final VoidCallback? onPressed;
  final Color? borderColor;
  final Color? color;
  final double borderWidth;
  const BorderedWidget({
    Key? key,
    required this.child,
    this.type = BorderedWidgetType.CIRCLE,
    this.width,
    this.height,
    this.onPressed,
    this.borderColor,
    this.color,
    this.borderWidth = 1.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return type == BorderedWidgetType.ROUNDED ? _roundedRect() : _circle();
  }

  Widget _roundedRect() {
    return Container(
      padding: EdgeInsets.only(
        top: 4.0,
        bottom: 4.0,
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            width: borderWidth,
            color: borderColor ?? theme.secondary40,
          ),
        ),
        child: child,
      ),
    );
  }

  Widget _circle() {
    return InkWell(
      hoverColor: theme.highlight,
      focusColor: theme.highlight,
      highlightColor: Colors.transparent,
      onTap: onPressed,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(width ?? 40),
          border: Border.all(
            width: borderWidth,
            color: borderColor ?? theme.secondary16,
          ),
          color: color ?? theme.secondary0,
        ),
        child: Center(
          child: child,
        ),
      ),
    );
  }
}
