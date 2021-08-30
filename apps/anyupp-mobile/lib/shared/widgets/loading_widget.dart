import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class CenterLoadingWidget extends StatelessWidget {
  final Color? color;
  final double size;
  final double strokeWidth;

  const CenterLoadingWidget({this.color, this.size = 32.0, this.strokeWidth = 4.0});

  @override
  Widget build(BuildContext context) {
    return Container(
        child: Center(
      child: Container(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          backgroundColor: color ?? theme.indicator,
          strokeWidth: strokeWidth,
          color: theme.background2,
        ),
      ),
    ));
  }
}
