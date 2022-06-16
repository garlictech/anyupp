import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import 'package:fa_prev/core/theme/theme.dart';

class AllergenGridWidget extends StatelessWidget {
  final String allergen;
  final int index;
  final String assetPath;
  final bool showName;
  final double fontSize;
  final double iconSize;

  const AllergenGridWidget({
    Key? key,
    required this.allergen,
    required this.index,
    required this.assetPath,
    this.showName = false,
    this.fontSize = 12.0,
    this.iconSize = 24.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      direction: Axis.vertical,
      children: [
        SvgPicture.asset(
          assetPath,
          color: theme.secondary,
          width: iconSize,
          height: iconSize,
        ),
        if (showName)
          SizedBox(
            height: 8,
          ),
        if (showName)
          Text(
            '$allergen ($index)',
            textAlign: TextAlign.center,
            style: Fonts.satoshi(
              fontSize: fontSize,
              color: theme.secondary,
              fontWeight: FontWeight.w400,
            ),
          )
      ],
    );
  }
}
