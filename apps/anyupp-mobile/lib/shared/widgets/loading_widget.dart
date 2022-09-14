import 'package:flutter/material.dart';
import '/core/theme/theme.dart';

class CenterLoadingWidget extends StatelessWidget {
  final Color? color;
  final Color? backgroundColor;
  final double size;
  final double strokeWidth;

  const CenterLoadingWidget(
      {Key? key,
      this.color,
      this.backgroundColor,
      this.size = 32.0,
      this.strokeWidth = 4.0})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        // color: backgroundColor ?? theme.secondary0,
        color: Colors.transparent,
        child: Center(
          child: Container(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              backgroundColor: Colors.transparent,
              strokeWidth: strokeWidth,
              color: color ?? theme.highlight,
            ),
          ),
        ));
  }
}
