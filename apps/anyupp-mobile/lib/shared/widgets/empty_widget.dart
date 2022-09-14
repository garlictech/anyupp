import 'package:flutter/material.dart';
import '/shared/locale.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '/core/theme/theme.dart';

typedef OnEmptyWidgetButtonTap = void Function();

class EmptyWidget extends StatelessWidget {
  final String? messageKey;
  final String? descriptionKey;
  final OnEmptyWidgetButtonTap? onTap;
  final String? buttonTextKey;
  final String? icon;
  final Color? background;
  final double iconSize;
  final double textFontSize;
  final double descriptionFontSize;
  final double horizontalPadding;

  const EmptyWidget({
    Key? key,
    this.messageKey,
    this.descriptionKey,
    this.onTap,
    this.buttonTextKey,
    this.icon = 'assets/icons/empty-box.svg',
    this.iconSize = 104.0,
    this.textFontSize = 16.0,
    this.descriptionFontSize = 12.0,
    this.horizontalPadding = 0.0,
    this.background,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: background ?? theme.secondary0,
      padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: _buildWidgetColumn(context),
        ),
      ),
    );
  }

  List<Widget> _buildWidgetColumn(BuildContext context) {
    bool isSvg = icon?.endsWith('svg') ?? false;
    var widgets = <Widget>[];
    if (icon != null) {
      widgets.add(
        isSvg
            ? SvgPicture.asset(
                icon!,
                width: iconSize,
                fit: BoxFit.fitWidth,
                color: theme.secondary,
              )
            : Image.asset(
                icon!,
                width: iconSize,
                fit: BoxFit.fitWidth,
                // color: theme.secondary,
              ),
      );
      widgets.add(
        SizedBox(
          height: 24.0,
        ),
      );
    }

    if (messageKey != null) {
      widgets.add(Text(
        trans(context, messageKey!),
        textAlign: TextAlign.center,
        style: Fonts.satoshi(
          color: theme.secondary,
          fontSize: textFontSize,
          fontWeight: FontWeight.w600,
        ),
      ));
    }

    if (descriptionKey != null) {
      widgets.add(SizedBox(
        height: 8.0,
      ));
      widgets.add(Text(
        trans(context, descriptionKey!),
        textAlign: TextAlign.center,
        style: Fonts.satoshi(
          color: theme.secondary,
          fontSize: descriptionFontSize,
          fontWeight: FontWeight.normal,
        ),
      ));
    }

    if (onTap != null && buttonTextKey != null) {
      widgets.add(SizedBox(
        height: 32.0,
      ));
      widgets.add(ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: theme.button,
          padding: EdgeInsets.only(
            top: 16,
            bottom: 16,
            left: 24,
            right: 24,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40),
          ),
        ),
        child: Text(
          trans(context, buttonTextKey!),
          style: Fonts.satoshi(
            fontSize: 16,
            color: theme.buttonText,
            fontWeight: FontWeight.normal,
          ),
        ),
        onPressed: onTap,
      ));
    }
    return widgets;
  }
}
