import 'dart:io';

import '/core/core.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

class RatingIconWidget extends StatelessWidget {
  final String icon;
  final String titleKey;
  final bool selected;
  final GestureTapCallback? onTap;

  const RatingIconWidget({
    Key? key,
    required this.icon,
    required this.titleKey,
    required this.selected,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          focusColor: Colors.transparent,
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          hoverColor: Colors.transparent,
          onTap: onTap,
          child: CircleAvatar(
            minRadius: 28,
            maxRadius: 28,
            backgroundColor: selected ? theme.icon : theme.secondary12,
            child: Image.asset(
              Platform.isAndroid
                  ? 'assets/android_icons/$icon'
                  : 'assets/ios_icons/$icon',
              width: 32.0,
              height: 32.0,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 16.0),
          child: Text(
            trans(context, titleKey),
            style: Fonts.satoshi(
              color: theme.secondary,
              fontSize: 12.0,
              fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        )
      ],
    );
  }
}
