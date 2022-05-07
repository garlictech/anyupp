import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class StatusWidget extends StatelessWidget {
  final String icon;
  final String? bigTitle;
  final String message;
  final String? description;
  final String? details;
  final String buttonText;
  final VoidCallback? onPressed;
  final bool? showButton;
  final Color? buttonColor;
  final bool expanded;
  final bool showIcon;

  const StatusWidget({
    Key? key,
    required this.icon,
    required this.message,
    required this.buttonText,
    this.bigTitle,
    this.description,
    this.details,
    this.onPressed,
    this.showButton = true,
    this.buttonColor,
    this.expanded = false,
    this.showIcon = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color color = buttonColor ?? theme.button;

    return Container(
      padding: EdgeInsets.all(16.0),
      // height: 400,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          if (expanded) Spacer(),
          if (showIcon)
            bigTitle != null
                ? Column(
                    children: [
                      Text(
                        bigTitle!,
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 55,
                        ),
                      ),
                      SizedBox(
                        height: 40.0,
                      ),
                    ],
                  )
                : Column(
                    children: [
                      SvgPicture.asset(
                        icon,
                        width: 80,
                        height: 80,
                      ),
                      SizedBox(
                        height: 40.0,
                      ),
                    ],
                  ),
          Text(
            trans(context, message),
            style: Fonts.satoshi(
              fontSize: 19.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          if (description != null)
            SizedBox(
              height: 16.0,
            ),
          if (description != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 42),
              child: Text(
                trans(context, description!),
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 15.0,
                  fontWeight: FontWeight.w400,
                  color: theme.secondary,
                ),
              ),
            ),
          if (details != null)
            Text(
              details!,
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 12.0,
                fontWeight: FontWeight.w300,
                color: theme.secondary.withOpacity(0.7),
              ),
            ),
          if (showButton == true && !expanded)
            SizedBox(
              height: 32.0,
            ),
          if (expanded && showButton == true) Spacer(),
          if (showButton == true)
            SafeArea(
              child: Container(
                width: double.infinity,
                height: 56,
                // margin: EdgeInsets.all(16.0),
                child: ElevatedButton(
                  onPressed: onPressed ?? () => Nav.pop(),
                  style: ElevatedButton.styleFrom(
                    primary: color,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40),
                    ),
                  ),
                  child: Text(
                    trans(context, buttonText),
                    style: Fonts.satoshi(
                      fontSize: 17.0,
                      fontWeight: FontWeight.w700,
                      color: theme.buttonText,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
