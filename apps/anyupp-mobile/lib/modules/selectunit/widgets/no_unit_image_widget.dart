import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:flutter/material.dart';

class NoUnitImageWidget extends StatelessWidget {
  final Color backgroundColor;
  final Color textColor;
  final double height;
  const NoUnitImageWidget({
    Key? key,
    required this.backgroundColor,
    required this.textColor,
    this.height = 104.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      // color: backgroundColor,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4.0),
        color: backgroundColor,
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            trans(context, 'selectUnit.noUnitImage'),
            style: Fonts.hH5(
              color: textColor,
            ),
          ),
        ),
      ),
    );
  }
}
