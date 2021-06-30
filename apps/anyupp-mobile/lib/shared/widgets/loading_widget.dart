import 'package:flutter/material.dart';

class CenterLoadingWidget extends StatelessWidget {
  final Color color;
  final double size;
  final double strokeWidth;

  const CenterLoadingWidget({Key key, this.color, this.size = 32.0, this.strokeWidth = 4.0}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        child: Center(
      child: Container(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          backgroundColor: color,
          strokeWidth: strokeWidth,
        ),
      ),
    ));
  }
}
